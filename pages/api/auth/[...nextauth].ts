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
      if (account) {
        console.log(account);
        token.oauth_token = account.oauth_token;
        token.oauth_secret = account.oauth_token_secret;
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
