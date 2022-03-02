import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import clientPromise from "utils/mongodb";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY || "",
      clientSecret: process.env.TWITTER_API_KEY_SECRET || "",
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async jwt({ token, account }) {
      // Persist the userId to token
      if (token) {
        token.userId = token.sub;
      }
      return token;
    },

    async session({ session, token, user }) {
      console.log(user);
      session.userId = user.id;
      console.log(session);
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log(user, account, profile, email, credentials);
      return true;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
