import Image from "next/image";
import Link from "next/link";

import { AvatarDropdown } from "~/components/header/avatar-dropdown";

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
            className="xs:block hidden"
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
          href="/examples"
          className="flex items-center text-sm font-medium hover:underline"
        >
          Examples
        </Link>
      </nav>

      <div className="flex space-x-5">
        <Link
          href="/dashboard"
          className="xs:flex hidden items-center text-sm font-medium hover:underline"
        >
          Dashboard
        </Link>

        <AvatarDropdown />
      </div>
    </header>
  );
};

export default Header;
