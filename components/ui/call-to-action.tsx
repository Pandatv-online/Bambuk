import type { ReactNode } from "react";

import type { LocalPath } from "@/data";

import { Button } from "./button";
import { Container } from "./container";
import { Heading } from "./typography";

export type CallToActionProps = Readonly<{
  title: string;
  children?: ReactNode;
  action:
    | Readonly<{ href: LocalPath; label: string; disabled?: false }>
    | Readonly<{ label: string; disabled: true }>;
  secondaryAction?: Readonly<{ href: LocalPath; label: string }>;
}>;

export function CallToAction({
  action,
  children,
  secondaryAction,
  title,
}: CallToActionProps) {
  return (
    <aside className="call-to-action" aria-label={title}>
      <Container className="call-to-action__inner">
        <div className="call-to-action__copy">
          <Heading as="h2" size="section">
            {title}
          </Heading>
          {children}
        </div>
        <div className="call-to-action__actions">
          {action.disabled ? (
            <Button disabled aria-disabled="true">
              {action.label}
            </Button>
          ) : (
            <Button href={action.href}>{action.label}</Button>
          )}
          {secondaryAction ? (
            <Button href={secondaryAction.href} variant="secondary">
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </aside>
  );
}
