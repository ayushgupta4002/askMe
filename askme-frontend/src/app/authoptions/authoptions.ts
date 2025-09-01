import { createUser } from "@/helpers/users";
import prisma from "@/lib/prisma";
import { AuthOptions, DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";

declare module "next-auth" {
  interface Session {
    user: {
      userId?: number;
      isGuest?: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    userId?: number;
    isGuest?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
    isGuest?: boolean;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "guest",
      name: "Guest",
      credentials: {},
      async authorize() {
        const user = {
          id: `guest-${Date.now()}`,
          name: "Guest User",
          //TODO : change domain from example.com to our domain later
          email: `guest-${Date.now()}@example.com`,
          isGuest: true,
        };

        try {
          // Create a temporary guest user in the database
          const dbUser = await createUser({
            name: user.name,
            email: user.email,
          });

          const cookieStore = await cookies();
          cookieStore.set('guestUserId', dbUser.id.toString());

          // Save userId in session object
          return {
            ...user,
            userId: dbUser.id,
          };
        } catch (error) {
          console.error("Error creating guest user:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Skip database check for guest users
      if (user.isGuest) {
        return true;
      }
      const email = user.email;
      const image = user.image;
      const name = user.name;

      try {
        console.log("User:", user);
        if (!email) {
          return false;
        }
        const session = await getSession();


        const userExist = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });
        if (userExist) {
          return true;
        }
        console.log("User exist:", userExist);

        const cookieStore = await cookies()

         const guestUserId = cookieStore.get('guestUserId')?.value

        if ( guestUserId && !userExist) {
          // in case user is converting from guest to registered user
          if (email && name) {
            console.log("Transferring guest user to registered user");
            cookieStore.delete('guestUserId');
          } else {
            throw new Error("Email or name is missing");
          }
        } else {
          // in case new user is signing up
          if (!userExist) {
            if (name && email) {
              await createUser({ name, email, image: image || undefined });
            } else {
              throw new Error("Name or email is missing");
            }
          }
        }
      } catch (error) {
        console.error("Error inserting user into the database:", error);
        return false;
      }

      return true;
    },
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user?.isGuest) {
        token.isGuest = true;
        token.userId = user.userId;
        return token;
      }
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true },
        });

        if (dbUser) {
          token.userId = dbUser.id;
        }
      }

      // Handle updates
      if (trigger === "update" && session?.user) {
        token.userId = session.user.userId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.isGuest = token.isGuest;
        if (typeof token.userId === "number") {
          session.user.userId = token.userId;
        }
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/dashboard/chat`;
    },
  },
  pages: {
    signIn: "/signin",
  },
};