import { PropsWithChildren } from "react";

type RenderListProps<T> = PropsWithChildren & {
  data: T[];
  text: string;
};

export default function RenderList<T>({
  children,
  data,
  text,
}: RenderListProps<T>) {
  if (!(data.length > 0)) {
    return <p>{text}</p>;
  }

  return children;
}
