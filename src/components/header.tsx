import {
  Laptop2,
  LayoutDashboard,
  LogIn,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

const AvatarDropdown = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  let userName: string | null | undefined;
  let subtitle: string | null | undefined;
  let avatar: React.ReactNode;
  let accountOption: React.ReactNode;

  if (status === "loading") {
    userName = "Loading...";
    subtitle = "Loading...";
    avatar = <Skeleton className="h-9 w-9 rounded-full cursor-pointer" />;
    accountOption = <DropdownMenuItem disabled>Loading...</DropdownMenuItem>;
  } else if (status === "authenticated") {
    userName = session.user?.name;
    subtitle = session.user?.email;
    avatar = (
      <Avatar className="h-9 w-9">
        <AvatarFallback className="cursor-pointer">
          <p className="scroll-m-20 text-xl font-semibold tracking-tight">
            {userName ? userName.charAt(0) : "S"}
          </p>
        </AvatarFallback>
      </Avatar>
    );
    accountOption = (
      <DropdownMenuItem onClick={() => signOut()}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign out
      </DropdownMenuItem>
    );
  } else {
    userName = "Guest";
    subtitle = "Log in to save your progress.";
    avatar = (
      <div className="flex h-9 w-9 rounded-full bg-zinc-100 dark:bg-zinc-900 items-center justify-center cursor-pointer">
        <User className="h-5 w-5" />
      </div>
    );
    accountOption = (
      <DropdownMenuItem onClick={() => signIn()}>
        <LogIn className="mr-2 h-4 w-4" />
        Sign in
      </DropdownMenuItem>
    );
  }

  // to avoid hydration mismatch, we render a skeleton before page is mounted on client
  // this is because on the server, `resolvedTheme` is undefined
  // also see https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  useEffect(() => setMounted(true), []);

  const resolvedIcon = !mounted ? (
    <Skeleton className="mr-2 h-4 w-4 rounded-full" />
  ) : resolvedTheme === "light" ? (
    <Sun className="mr-2 h-4 w-4" />
  ) : (
    <Moon className="mr-2 h-4 w-4" />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <p>{userName ? userName : "Scallop user"}</p>
          <p className="text-sm font-normal text-muted-foreground">
            {subtitle ? subtitle : "You are logged in."}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            {resolvedIcon} Appearance
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop2 className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            href="/dashboard"
            className="flex w-full items-center cursor-default"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Go to dashboard
          </Link>
        </DropdownMenuItem>
        {accountOption}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-background p-2">
      <nav className="flex space-x-8">
        <Link
          href="/"
          className="ml-1 flex items-center space-x-2 hover:underline"
        >
          <Image
            width={25}
            height={25}
            src="/content/logo.svg"
            alt="Scallop logo"
          />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Playground
          </h4>
        </Link>
        <Link
          href="/examples"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Examples
        </Link>
        <Link
          href="https://scallop-lang.github.io/doc/index.html"
          target="_blank"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Language Docs
        </Link>
        <Link
          href="https://scallop-lang.github.io/"
          target="_blank"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Main Site
        </Link>
      </nav>
      <AvatarDropdown />
    </header>
  );
};

export default Header;
