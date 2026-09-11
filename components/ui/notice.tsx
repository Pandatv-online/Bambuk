import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./class-names";

export type NoticeProps = Readonly<{
  children: ReactNode;
  className?: string;
}> &
  Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

export function Notice({ children, className, ...props }: NoticeProps) {
  return (
    <div className={classNames("notice", className)} {...props}>
      {children}
    </div>
  );
}
