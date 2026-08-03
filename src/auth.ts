import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Tekakonik Credentials",
      credentials: {
        username: { label: "Username / Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username as string;
        const password = credentials.password as string;

        try {
          const user = await db.user.findFirst({
            where: {
              OR: [{ username }, { email: username }],
            },
          });

          if (!user || !user.passwordHash) return null;

          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.username,
            email: user.email || "",
            role: user.role,
          };
        } catch (e) {
          console.error("Auth error:", e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // Auto-create or update Google User in Postgres DB
          const usernameFromEmail = user.email.split("@")[0] + "_" + Math.floor(Math.random() * 1000);
          const dbUser = await db.user.upsert({
            where: { email: user.email },
            update: {},
            create: {
              email: user.email,
              username: user.name ? user.name.replace(/\s+/g, "_") : usernameFromEmail,
              role: "USER",
              tinta: 100,
            },
          });
          user.id = dbUser.id;
          (user as { role?: string }).role = dbUser.role;
        } catch (e) {
          console.error("Google sign in upsert error:", e);
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "USER";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = (token.role as string) || "USER";
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});
