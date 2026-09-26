import { footerLegalNavigation, navigation } from "@/data";
import { siteConfig } from "@/lib/site-config";

import { Container } from "../ui/container";
import { BrandLockup } from "./brand-lockup";

export function SiteFooter() {
  const { contact } = siteConfig;

  return (
    <footer className="site-footer">
      <Container className="site-footer__grid">
        <div className="site-footer__identity">
          <BrandLockup />
          <address>
            <p>Palvelemme Suomessa ja Virossa.</p>
            {contact.phone && contact.phoneHref ? (
              <p>
                <a href={contact.phoneHref}>{contact.phone}</a>
                <br />
                <span>{contact.hours}</span>
              </p>
            ) : null}
            <p>{contact.visitWording}</p>
          </address>
        </div>
        <nav className="site-footer__navigation" aria-label="Alatunnisteen navigaatio">
          {navigation.map((item) => (
            <div className="site-footer__group" key={item.id}>
              <a className="site-footer__heading" href={item.href}>
                {item.label}
              </a>
              {item.children?.length ? (
                <ul>
                  {item.children.map((child) => (
                    <li key={child.id}>
                      <a href={child.href}>{child.label}</a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
          {footerLegalNavigation.length ? (
            <div className="site-footer__group">
              <p className="site-footer__heading">Tietoa sivustosta</p>
              <ul>
                {footerLegalNavigation.map((item) => (
                  <li key={item.id}>
                    <a href={item.href}>{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </nav>
      </Container>
      <Container className="site-footer__credit">
        Sivuston suunnittelu ja toteutus: <a href="https://verzo.pro/">verzo.pro</a>
      </Container>
    </footer>
  );
}
