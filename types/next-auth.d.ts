import type { Role } from "@prisma/client";
import { type DefaultSession } from "next-auth";

// see https://authjs.dev/getting-started/typescript#main-module
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }
}
