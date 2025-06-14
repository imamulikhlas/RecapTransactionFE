// /app/api/imap-test/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import Imap from 'imap-simple'

export async function POST(req: NextRequest) {
  try {
    const { email_user, email_pass } = await req.json()

    const config = {
      imap: {
        user: email_user,
        password: email_pass,
        host: "imap.gmail.com",
        port: 993,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
      },
    }

    const connection = await Imap.connect(config)
    await connection.end()

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to connect to Gmail" },
      { status: 400 }
    )
  }
}
