import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "tekakomik-super-secret-key-2026-modern-comic-game",
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
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

          // Periksa apakah user di-banned
          if (user.isBanned) {
            const now = new Date();
            if (user.bannedUntil && user.bannedUntil.getTime() <= now.getTime()) {
              // Jika masa suspend sudah lewat, otomatis unban
              await db.user.update({
                where: { id: user.id },
                data: { isBanned: false, banReason: null, bannedUntil: null },
              });
            } else {
              // Kirim string error suspend terformat
              const untilStr = user.bannedUntil ? user.bannedUntil.toISOString() : "permanen";
              throw new Error(`SUSPENDED:${untilStr}:${user.banReason || "Pelanggaran aturan"}`);
            }
          }

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
          throw e; // Lemparkan error agar ditangkap oleh frontend login
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (existingUser?.isBanned) {
            const now = new Date();
            if (existingUser.bannedUntil && existingUser.bannedUntil.getTime() <= now.getTime()) {
              // Buka suspend otomatis
              await db.user.update({
                where: { id: existingUser.id },
                data: { isBanned: false, banReason: null, bannedUntil: null },
              });
            } else {
              const untilStr = existingUser.bannedUntil ? existingUser.bannedUntil.toISOString() : "permanen";
              return `/auth/login?error=Banned&until=${untilStr}&reason=${encodeURIComponent(existingUser.banReason || "Akun ditangguhkan oleh admin")}`;
            }
          }

          // Auto-create or update Google User
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
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
});
