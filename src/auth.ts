import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    scope:
                        "openid email profile https://www.googleapis.com/auth/youtube",
                    access_type: "offline",
                    prompt: "consent",
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Initial sign in
            if (account) {
                return {
                    accessToken: account.access_token,
                    refreshToken: account.refresh_token,
                    expiresAt: account.expires_at,
                };
            }

            // Return previous token if the access token has not expired yet
            // Give a 10 second buffer
            if (Date.now() < (token.expiresAt as number) * 1000 - 10000) {
                return token;
            }

            // Access token has expired, try to update it
            try {
                // https://accounts.google.com/.well-known/openid-configuration
                // We need the `token_endpoint`.
                const response = await fetch("https://oauth2.googleapis.com/token", {
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        client_id: process.env.AUTH_GOOGLE_ID!,
                        client_secret: process.env.AUTH_GOOGLE_SECRET!,
                        grant_type: "refresh_token",
                        refresh_token: token.refreshToken as string,
                    }),
                    method: "POST",
                });

                const tokens = await response.json();

                if (!response.ok) throw tokens;

                return {
                    ...token,
                    accessToken: tokens.access_token,
                    expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
                    // Fall back to old refresh token as Google doesn't always return a new one
                    refreshToken: tokens.refresh_token ?? token.refreshToken,
                };
            } catch (error) {
                console.error("Error refreshing access token", error);
                // The error property will be used client-side to handle the refresh token error
                return { ...token, error: "RefreshAccessTokenError" };
            }
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            // @ts-ignore
            session.error = token.error;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});
