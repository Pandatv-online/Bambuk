import { siteConfig } from "@/lib/site-config";

export function BrandLockup() {
  const { company, contact } = siteConfig;
  const accessibleLabel = [company.displayName, contact.phone, contact.hours]
    .filter(Boolean)
    .join(", ");

  return (
    <span className="brand-lockup" aria-label={accessibleLabel}>
      <a className="brand-lockup__name" href="/fi">
        {company.displayName}
      </a>
      {contact.phone && contact.phoneHref ? (
        <a className="brand-lockup__descriptor" href={contact.phoneHref}>
          {contact.phone}
        </a>
      ) : null}
      <span className="brand-lockup__descriptor">{contact.hours}</span>
    </span>
  );
}
