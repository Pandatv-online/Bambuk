import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

import type { LocalPath } from "@/data";

import { classNames } from "./class-names";

type SharedProps = Readonly<{
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "text";
}>;

type ButtonLinkProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href"> &
  Readonly<{ href: LocalPath }>;

type NativeButtonProps = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> &
  Readonly<{ href?: never }>;

export type ButtonProps = ButtonLinkProps | NativeButtonProps;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = classNames("button", `button--${variant}`, className);

  if ("href" in props && props.href) {
    const linkProps = props as Omit<
      AnchorHTMLAttributes<HTMLAnchorElement>,
      "className"
    > & { href: LocalPath };
    return (
      <a className={classes} {...linkProps}>
        {children}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...buttonProps} type={buttonProps.type ?? "button"}>
      {children}
    </button>
  );
}
