import Link from "next/link";
import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = PropsWithChildren & {
  isLink?: boolean;
  className?: string;
  href?: string;
  pending?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
};

export default function Button({
  isLink = false,
  href = "",
  className = "",
  pending,
  children,
  type,
}: ButtonProps) {
  const baseStyles =
    "text-center py-3 font-bold rounded-xl bg-primary hover:bg-primary/50";

  if (isLink && href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${className ? className : ""}`}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={pending}
      className={`${baseStyles} ${className ? className : ""}`}
    >
      {pending ? "صبر کنید..." : children}
    </button>
  );
}
