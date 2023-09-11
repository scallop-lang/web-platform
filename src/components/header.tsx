import { Laptop2, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

const AppearanceSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  // to avoid hydration mismatch, we render a skeleton before page is mounted on client
  // this is because on the server, `resolvedTheme` is undefined
  // also see https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
  useEffect(() => setMounted(true), []);

  const resolvedIcon = !mounted ? (
    <Skeleton className="h-4 w-4 rounded-full" />
  ) : resolvedTheme === "light" ? (
    <Sun className="h-4 w-4" />
  ) : (
    <Moon className="h-4 w-4" />
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          aria-haspopup
        >
          {resolvedIcon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="justify-between"
        >
          Light <Sun className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="justify-between"
        >
          Dark <Moon className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="justify-between"
        >
          System <Laptop2 className="h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const Header = () => {
  return (
    <header className="flex w-full items-center justify-between border-b border-border bg-neutral-50 p-3 dark:bg-neutral-950">
      <div className="flex items-center space-x-3">
        <Image
          src="/content/logo.svg"
          width={25}
          height={25}
          alt="Scallop logo"
        />
        <h1 className="w-28 cursor-default text-lg font-semibold leading-none sm:w-full sm:text-xl">
          Playground
        </h1>
      </div>
      <div className="flex items-center space-x-7">
        <div className="flex flex-col items-end justify-end sm:flex-row sm:space-x-7">
          <Link
            href="https://scallop-lang.github.io/"
            target="_blank"
            className="inline-flex items-center justify-center text-right text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Website
          </Link>
          <Link
            href="https://github.com/scallop-lang"
            target="_blank"
            className="inline-flex items-center justify-center text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            GitHub
          </Link>
        </div>
        <AppearanceSwitcher />
      </div>
    </header>
  );
};

export default Header;
