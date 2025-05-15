"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type AsideLinkProps = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export default function AsideLink({ href, icon, title }: AsideLinkProps) {
  const pathname = usePathname();
  const segments = href.split("/").filter(Boolean);
  const hasSubRoute = segments.length > 1;

  const isActivePath = hasSubRoute
    ? pathname.startsWith(href)
    : pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex-align-center gap-x-3 p-2.5 border-r-4 border-secondary transition ${
          isActivePath
            ? "bg-secondary text-primary border-primary"
            : "hover:text-primary hover:border-primary hover:bg-secondary"
        }`}
      >
        <span className="text-xl">{icon}</span>
        <span>{title}</span>
      </Link>
    </li>
  );
}
