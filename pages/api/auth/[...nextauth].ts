import NextAuth from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import { TwitterClient } from "services/twitter";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_API_KEY || "",
      clientSecret: process.env.TWITTER_API_KEY_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        console.log(account);
        token.oauth_token = account.oauth_token;
        token.oauth_secret = account.oauth_token_secret;
        TwitterClient.login(
          account!.oauth_token as string,
          account!.oauth_token_secret as string
        );
        console.log("logged in");
      }

      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
