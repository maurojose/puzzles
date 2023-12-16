import NextAuth from "next-auth";
import prisma from "@/prisma";
import { Account, User as AuthUser } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { main } from "../../route";

const authOptions: any = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          await main();
          const user = await prisma.users.findFirst({
            where: {
              email: credentials.email
            }
          });
          if (user) {
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user;
            }
          }
        } catch (err: any) {
          throw new Error(err);
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    // ...add more providers here
  ],
  callbacks: {
    async signIn({ user, account }: { user: AuthUser; account: Account }) {
      if (account?.provider == "credentials") {
        return true;
      }
      if (account?.provider == "github") {
        try {
          await main();
          const usergit = user.email;
          const existingUser = await prisma.users.find(item => item.email === usergit);
          if (!existingUser) {
            const nome = "mauro"; // teste
            const saldo = "0"; //teste
            const userspost = await prisma.users.create({ data: { nome, saldo, usergit } });
            console.log("inserindo o usuário:", userspost);
          }
          return true;
      } catch (err) {
        console.log("Error saving user", err);
        return false;
      } finally {
        await prisma.$disconnect();
      }
    }
  },
},
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
