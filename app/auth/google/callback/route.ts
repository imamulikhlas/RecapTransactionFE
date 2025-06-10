import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state") // userId
  const error = searchParams.get("error")

  if (error) {
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: '${error}'
            }, '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }

  if (!code) {
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: 'No authorization code received'
            }, '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/auth/google/callback`,
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      throw new Error(tokens.error_description || "Failed to exchange code for tokens")
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    })

    const userInfo = await userResponse.json()

    if (!userResponse.ok) {
      throw new Error("Failed to get user information")
    }

    // Return success with tokens and user info
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_SUCCESS',
              tokens: {
                access_token: '${tokens.access_token}',
                refresh_token: '${tokens.refresh_token}',
                expires_in: ${tokens.expires_in}
              },
              email: '${userInfo.email}'
            }, '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  } catch (error: any) {
    return new NextResponse(
      `
      <html>
        <body>
          <script>
            window.opener.postMessage({
              type: 'GOOGLE_OAUTH_ERROR',
              error: '${error.message || "Authentication failed"}'
            }, '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}');
            window.close();
          </script>
        </body>
      </html>
    `,
      {
        headers: { "Content-Type": "text/html" },
      },
    )
  }
}
