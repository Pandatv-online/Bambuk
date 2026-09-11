import type { HTMLAttributes, ReactNode } from "react";

import { classNames } from "./class-names";

export type HeadingProps = Readonly<{
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
  size?: "display" | "page" | "section" | "compact";
}> &
  Omit<HTMLAttributes<HTMLHeadingElement>, "children" | "className">;

export function Heading({
  as: Element = "h2",
  children,
  className,
  size = "section",
  ...props
}: HeadingProps) {
  return (
    <Element className={classNames("heading", `heading--${size}`, className)} {...props}>
      {children}
    </Element>
  );
}

export function Eyebrow({
  children,
  className,
  ...props
}: Readonly<HTMLAttributes<HTMLParagraphElement>>) {
  return (
    <p className={classNames("eyebrow", className)} {...props}>
      {children}
    </p>
  );
}
