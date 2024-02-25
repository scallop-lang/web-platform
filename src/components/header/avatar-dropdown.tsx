import {
  ExternalLink,
  LayoutDashboard,
  LogIn,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
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
  } else if (status === "authenticated") {
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
  } else if (status === "unauthenticated") {
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

        <DropdownMenuSeparator className="xs:hidden" />

        <DropdownMenuItem
          asChild
          className="xs:hidden"
        >
          <Link
            href="/dashboard"
            className="flex grow items-center justify-between"
          >
            Dashboard <LayoutDashboard size={16} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="https://discord.gg/QVFnzJMvNB"
            className="flex grow items-center justify-between"
            target="_blank"
          >
            Join Discord server <ExternalLink size={16} />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://www.scallop-lang.org"
            className="flex grow items-center justify-between"
            target="_blank"
          >
            scallop-lang.org <ExternalLink size={16} />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="https://www.scallop-lang.org/doc/index.html"
            className="flex grow items-center justify-between"
            target="_blank"
          >
            Language documentation <ExternalLink size={16} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/privacy-policy"
            className="flex grow items-center justify-between"
          >
            Privacy policy <Shield size={16} />
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <>{accountOption}</>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export { AvatarDropdown };
