/* eslint-disable no-unused-vars */
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      token: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
