import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  // Configure session strategy for middleware compatibility
  session: {
    strategy: "jwt",
  },
  // Callbacks to sync user data between JWT and database
  callbacks: {
    async jwt({ token, user, account }) {
      // console.log("🔐 JWT callback");
      // console.log("👉 account:", account);
      // console.log("👉 user:", user);
      // console.log("👉 profile:", profile);
      // console.log("👉 token (before):", token);

      // Persist the OAuth access_token and user data to the token right after signin
      if (account && user) {
        token.accessToken = account.access_token;
        token.id = user.id;
      }
      // console.log("token after", token);

      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      // console.log("🔐 Session callback");
      // console.log("👉 session before:", session);
      // console.log("👉 token before:", token);
      if (token && session.user) {
        (session.user as any).id = token.id as string;
      }
      // console.log("session after", session);
      return session;
    },
  },
});
