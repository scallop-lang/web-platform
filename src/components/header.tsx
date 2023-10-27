import { Laptop2, LogIn, LogOut, Moon, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
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
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";

const AvatarDropdown = () => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  let userName: string | null | undefined;
  let subtitle: string | null | undefined;
  let avatar: React.ReactNode;
  let accountOption: React.ReactNode;

  if (status === "loading") {
    userName = "Loading...";
    subtitle = "Loading...";
    avatar = <Skeleton className="h-9 w-9 cursor-pointer rounded-full" />;
    accountOption = <DropdownMenuItem disabled>Loading...</DropdownMenuItem>;
  }

  if (status === "authenticated") {
    const imageUrl = session.user?.image;

    userName = session.user?.name;
    subtitle = session.user?.email;

    avatar = (
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={imageUrl ? imageUrl : ""}
          alt={"Profile picture"}
        />
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
  }

  if (status === "unauthenticated") {
    userName = "Guest";
    subtitle = "Sign in to save your progress and to access the dashboard.";

    avatar = (
      <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900">
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{avatar}</DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[250px]"
      >
        <DropdownMenuLabel>
          <span>
            {`${userName ? userName : "Scallop user"}${
              session?.user?.role
                ? ` (${session.user.role === "ADMIN" ? "Admin" : "User"})`
                : ""
            }`}
          </span>
          <p className="text-sm font-normal text-muted-foreground">
            {subtitle ? subtitle : "You are logged in."}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span className="flex flex-col">
              <p>Appearance</p>
              <p className="text-sm text-muted-foreground">
                {theme === "system"
                  ? `System (${resolvedTheme})`
                  : resolvedTheme === "light"
                  ? "Light"
                  : "Dark"}
              </p>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <span className="bg-red-100">Light</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
                <Moon className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
                <Laptop2 className="mr-2 h-4 w-4" />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {accountOption}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-background p-2">
      <nav className="flex space-x-5">
        <Link
          href="https://scallop-lang.github.io/"
          target="_blank"
          className="ml-1 flex items-center space-x-1.5 hover:underline"
        >
          <Image
            width={18}
            height={18}
            src="/content/logo.svg"
            alt="Scallop logo"
          />
          <h4 className="scroll-m-20 text-lg font-semibold tracking-tight">
            Scallop
          </h4>
        </Link>

        <Link
          href="https://play.scallop-lang.org/"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Playground
        </Link>

        <Link
          href="/featured"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Featured
        </Link>

        <Link
          href="https://scallop-lang.github.io/doc/index.html"
          target="_blank"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Language Docs
        </Link>
      </nav>
      <div className="flex space-x-5">
        <Link
          href="/dashboard"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Dashboard
        </Link>
        <AvatarDropdown />
      </div>
    </header>
  );
};

export default Header;
