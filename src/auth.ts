// src/auth.ts
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
// import bcrypt from "bcrypt";

import { compare } from "bcryptjs";



// Export the helpers that NextAuth v5 gives you
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  // JWT sessions work well with middleware and edge
  session: { strategy: "jwt" },

  // Providers: OAuth (Google/GitHub) + Credentials
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // keep default minimal scopes (openid, email, profile)
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // default scopes give basic profile/email only
    }),
    Credentials({
      id: "credentials",
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        if (!creds?.email || !creds.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: creds.email as string },
        });
        if (!user || !user.passwordHash) return null;

        const ok = await compare(creds.password as string, user.passwordHash);
        if (!ok) return null;

        // Return minimal user object; adapter fills the rest
        return { id: user.id, email: user.email, name: user.name ?? undefined };
      },
    }),
  ],

  // Keep tokens minimal: only stash your own user.id
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // On first sign-in, attach the DB user id to the JWT
        token.id = (user as any).id;
      }
      // Do NOT keep provider access tokens since we won't call their APIs
      // (i.e., no token.accessToken, no refresh_token)
      return token;
    },
    async session({ session, token }) {
      // Expose user id to the client session for convenience
      if (session.user && token?.id) {
        (session.user as any).id = token.id as string;
      }
      return session;
    },
  },
});
