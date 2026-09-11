import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./class-names";

export type SectionProps = Readonly<{
  children: ReactNode;
  className?: string;
  tone?: "page" | "cream" | "white" | "green";
}> &
  Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Section({
  children,
  className,
  tone = "page",
  ...props
}: SectionProps) {
  return (
    <section className={classNames("section", `section--${tone}`, className)} {...props}>
      {children}
    </section>
  );
}
