import type { Role } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";

// see https://authjs.dev/getting-started/typescript#main-module
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session {
    user?: {
      id?: string;
      role?: Role;
    } & DefaultSession["user"];
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  export interface User extends DefaultUser {
    role: Role;
  }
}
