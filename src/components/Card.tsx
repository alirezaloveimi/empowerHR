import { PropsWithChildren } from "react";

type CardProps = PropsWithChildren & {
  className?: string;
};

export default function Card({ children, className = "" }: CardProps) {
  const basicStyles = "bg-secondary rounded-xl p-4";

  return (
    <div className={`${basicStyles} ${className ? className : ""}`}>
      {children}
    </div>
  );
}
