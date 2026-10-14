import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../lib/prisma";

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),

    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn(user, account, profile) {
      const user_name = user.profile.name.toString();
      const user_email = user.profile.email.toString();

      //  console.log(user.profile.email);

      const existingUser = await prisma.user.findUnique({
        where: {
          email: user_email,
        },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            name: user_name,

            email: user_email,
          },
        });

        // console.log(user.profile.name);

        // console.log(user.profile.email);
      }

      return true;
    },

    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith("/")) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
  },
};

export default NextAuth(authOptions);
