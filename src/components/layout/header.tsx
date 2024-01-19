import { ExternalLink, LogIn, LogOut, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";

const AvatarDropdown = () => {
  const { data: session, status } = useSession();

  let userName: string | null | undefined;
  let subtitle: string | null | undefined;
  let avatar: React.ReactNode;
  let accountOption: React.ReactNode;

  if (status === "loading") {
    userName = "Getting user...";
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
        <span className="flex grow items-center justify-between">
          Sign out
          <LogOut className="h-4 w-4" />
        </span>
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
        <span className="flex grow items-center justify-between">
          Sign in
          <LogIn className="h-4 w-4" />
        </span>
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

        <DropdownMenuItem
          onClick={() => window.open("https://www.scallop-lang.org/", "_blank")}
        >
          <span className="flex grow items-center justify-between">
            Visit scallop-lang <ExternalLink className="h-4 w-4" />
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open("https://www.scallop-lang.org/doc/index.html", "_blank")
          }
        >
          <span className="flex grow items-center justify-between">
            Language documentation <ExternalLink className="h-4 w-4" />
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <>{accountOption}</>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-background p-2">
      <nav className="flex space-x-5">
        <Link
          href="/"
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
          href="/play"
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
