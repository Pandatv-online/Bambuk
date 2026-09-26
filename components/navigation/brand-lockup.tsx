import Image from "next/image";

import { siteConfig } from "@/lib/site-config";

export function BrandLockup({
  showCompanyName = true,
}: Readonly<{ showCompanyName?: boolean }>) {
  const { company, contact } = siteConfig;

  return (
    <span className="brand-lockup">
      <a className="brand-lockup__logo" href="/fi">
        <Image
          src="/brand/bambu-logo.svg"
          alt="Bambu — lattia ja terassi"
          width={230}
          height={96}
          unoptimized
        />
      </a>
      <span className="brand-lockup__business">
        {showCompanyName ? <strong>{company.displayName}</strong> : null}
        {contact.phone && contact.phoneHref ? (
          <a href={contact.phoneHref}>{contact.phone}</a>
        ) : null}
        <span>{contact.hours}</span>
      </span>
    </span>
  );
}
