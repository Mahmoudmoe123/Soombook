import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      secret: "J4cKP1He0trdkH6CH5K8bvPHwpX6l0dxQsWjS/24vc4=" ,


    }),

    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
