import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Resend({
      from:   process.env.RESEND_FROM_EMAIL ?? "noreply@suamorada.pt",
      apiKey: process.env.RESEND_API_KEY,
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn:  "/entrar",
    signOut: "/",
    error:   "/entrar",
    verifyRequest: "/entrar/verificar",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as never as { role: string }).role ?? "buyer"; }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id as string;
        (session.user as never as { role: string }).role = token.role as string;
      }
      return session;
    },
  },
});
