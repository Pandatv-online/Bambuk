import { navigation } from "@/data";

import { Button } from "../ui/button";
import { Container } from "../ui/container";
import { BrandLockup } from "./brand-lockup";
import { DesktopNavigation } from "./desktop-navigation";
import { MobileNavigation } from "./mobile-navigation";

export type SiteHeaderProps = Readonly<{
  appearance?: "hero" | "inner";
}>;

export function SiteHeader({ appearance = "inner" }: SiteHeaderProps) {
  return (
    <header className={`site-header site-header--${appearance}`}>
      <Container className="site-header__inner">
        <a className="site-header__brand" href="/fi">
          <BrandLockup />
        </a>
        <DesktopNavigation items={navigation} />
        <Button className="site-header__quote" href="/fi#yhteys">
          Pyydä tarjous
        </Button>
        <MobileNavigation items={navigation} />
      </Container>
    </header>
  );
}
