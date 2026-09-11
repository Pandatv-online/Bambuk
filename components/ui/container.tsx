import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./class-names";

export type ContainerProps = Readonly<{
  children: ReactNode;
  className?: string;
}> &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div className={classNames("container", className)} {...props}>
      {children}
    </div>
  );
}
