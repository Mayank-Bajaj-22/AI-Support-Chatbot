# Scalekit Authentication Setup in Next.js

This guide explains how to integrate **Scalekit** authentication in a **Next.js** application.

Scalekit provides authentication infrastructure for modern applications, including **SSO, identity federation, and secure session management**.

---

# 1. Install Scalekit SDK

Run the following command inside your project:

```bash
npm install @scalekit-sdk/node
```

---

# 2. Configure Environment Variables

Add the following variables to your `.env` file.

```env
SCALEKIT_ENVIRONMENT_URL=<your-environment-url>
SCALEKIT_CLIENT_ID=<your-client-id>
SCALEKIT_CLIENT_SECRET=<your-client-secret>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

These credentials are provided when you create an application in the Scalekit dashboard.

---

# 3. Initialize Scalekit Client

Create a file:

```
lib/scalekit.ts
```

```ts
import { Scalekit } from "@scalekit-sdk/node";

// Initialize the Scalekit client with your credentials
export const scalekit = new Scalekit(
  process.env.SCALEKIT_ENVIRONMENT_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!
);
```

This file initializes the Scalekit SDK so it can be reused across your API routes.

---

# 4. Create Login Route

Create the following API route:

```
app/api/auth/login/route.ts
```

```ts
import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  const url = scalekit.getAuthorizationUrl(redirectUri);

  return NextResponse.redirect(url);
}
```

### What happens here

1. User clicks **Login**
2. Request goes to `/api/auth/login`
3. User is redirected to Scalekit authentication page

---

# 5. Create Callback Route

Create the following API route:

```
app/api/auth/callback/route.ts
```

```ts
import { scalekit } from "@/lib/scalekit";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

  if (!code) {
    return NextResponse.json(
      { message: "Authorization code not found" },
      { status: 400 }
    );
  }

  const session = await scalekit.authenticateWithCode(code, redirectUri);

  console.log(session);

  const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);

  response.cookies.set("access_token", session.accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: false,
    path: "/",
  });

  return response;
}
```

### What happens here

1. Scalekit redirects the user to this route after authentication.
2. The `code` query parameter is extracted from the URL.
3. The authorization code is exchanged for a **session token**.
4. The token is stored securely in an **HTTP-only cookie**.
5. The user is redirected back to the application.

---

# 6. Add Login Button

Add a login handler in your frontend.

```javascript
const handleLogin = () => {
  window.location.href = "/api/auth/login";
};
```

Use it in a button:

```jsx
<button onClick={handleLogin}>Login</button>
```

---

# 7. Authentication Flow

The complete authentication flow works like this:

```
User clicks Login
        ↓
Next.js /api/auth/login
        ↓
Redirect to Scalekit
        ↓
User authenticates
        ↓
Scalekit redirects to /api/auth/callback
        ↓
Authorization code exchanged for session
        ↓
Access token stored in cookie
        ↓
User logged in
```

---

# 8. Project Structure

```
project-root
│
├── app
│   └── api
│       └── auth
│           ├── login
│           │   └── route.ts
│           └── callback
│               └── route.ts
│
├── lib
│   └── scalekit.ts
│
├── .env
└── package.json
```

---

