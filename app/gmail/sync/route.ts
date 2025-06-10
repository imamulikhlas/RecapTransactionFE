import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser, supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's Gmail settings
    const { data: settings, error: settingsError } = await supabase!
      .from("email_transactions")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (settingsError || !settings) {
      return NextResponse.json({ error: "Gmail not connected" }, { status: 400 })
    }

    // Use refresh token to get new access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: settings.email_pass, // We stored refresh token as "password"
        grant_type: "refresh_token",
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error("Failed to refresh access token")
    }

    // Get Gmail messages
    const gmailResponse = await fetch(
      "https://www.googleapis.com/gmail/v1/users/me/messages?q=from:(bank OR payment OR transaction) newer_than:7d&maxResults=50",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    )

    const gmailData = await gmailResponse.json()

    if (!gmailResponse.ok) {
      throw new Error("Failed to fetch Gmail messages")
    }

    // Process messages and extract transactions
    const transactions = []

    for (const message of gmailData.messages || []) {
      try {
        const messageResponse = await fetch(`https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })

        const messageData = await messageResponse.json()

        // Extract transaction data from email content
        const transaction = extractTransactionFromEmail(messageData)

        if (transaction) {
          transactions.push({
            ...transaction,
            user_id: user.id,
          })
        }
      } catch (error) {
        console.error("Error processing message:", error)
      }
    }

    // Save transactions to database
    if (transactions.length > 0) {
      const { error: insertError } = await supabase!
        .from("transactions")
        .upsert(transactions, { onConflict: "reference" })

      if (insertError) {
        throw insertError
      }
    }

    // Log sync activity
    await supabase!.from("email_logs").insert({
      account_id: settings.id,
      user_id: user.id,
      status: "success",
      message: `Sync completed - ${transactions.length} transactions processed`,
    })

    return NextResponse.json({
      success: true,
      processed: transactions.length,
      message: `Successfully processed ${transactions.length} transactions`,
    })
  } catch (error: any) {
    console.error("Gmail sync error:", error)

    // Log error
    const user = await getCurrentUser()
    if (user && supabase) {
      await supabase.from("email_logs").insert({
        account_id: 1, // Default account ID
        user_id: user.id,
        status: "error",
        message: error.message || "Sync failed",
      })
    }

    return NextResponse.json({ error: error.message || "Sync failed" }, { status: 500 })
  }
}

// Helper function to extract transaction data from email
function extractTransactionFromEmail(messageData: any) {
  try {
    const headers = messageData.payload.headers
    const subject = headers.find((h: any) => h.name === "Subject")?.value || ""
    const from = headers.find((h: any) => h.name === "From")?.value || ""

    // Get email body
    let body = ""
    if (messageData.payload.body?.data) {
      body = Buffer.from(messageData.payload.body.data, "base64").toString()
    } else if (messageData.payload.parts) {
      for (const part of messageData.payload.parts) {
        if (part.mimeType === "text/plain" && part.body?.data) {
          body += Buffer.from(part.body.data, "base64").toString()
        }
      }
    }

    // Simple transaction extraction logic
    const amountMatch = body.match(/(?:Rp|IDR|USD|\$)\s*([\d,]+(?:\.\d{2})?)/i)
    const dateMatch = messageData.internalDate

    if (amountMatch) {
      const amount = Number.parseFloat(amountMatch[1].replace(/,/g, ""))
      const isExpense =
        body.toLowerCase().includes("debit") ||
        body.toLowerCase().includes("payment") ||
        body.toLowerCase().includes("purchase")

      return {
        reference: `EMAIL-${messageData.id}`,
        date: new Date(Number.parseInt(dateMatch)).toISOString().split("T")[0],
        description: subject,
        amount: isExpense ? -amount : amount,
        provider: from.split("@")[1]?.split(">")[0] || "Email",
        transaction_type: isExpense ? "expense" : "income",
        account_from: isExpense ? "Personal Account" : "External",
        account_to: isExpense ? "External" : "Personal Account",
        fee: 0,
        total_amount: isExpense ? -amount : amount,
        raw_payload: {
          email_id: messageData.id,
          subject,
          from,
          body: body.substring(0, 500), // Store first 500 chars
        },
      }
    }

    return null
  } catch (error) {
    console.error("Error extracting transaction:", error)
    return null
  }
}
