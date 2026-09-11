import type { NavigationItem } from "@/data";
import { navigation } from "@/data";

export type DesktopNavigationProps = Readonly<{
  items?: readonly NavigationItem[];
}>;

function NavigationBranch({ item }: Readonly<{ item: NavigationItem }>) {
  if (!item.children?.length) {
    return <a href={item.href}>{item.label}</a>;
  }

  return (
    <details className="desktop-navigation__disclosure">
      <summary>{item.label}</summary>
      <ul className="desktop-navigation__dropdown">
        <li>
          <a href={item.href}>Näytä kaikki</a>
        </li>
        {item.children.map((child) => (
          <li key={child.id}>
            <NavigationBranch item={child} />
          </li>
        ))}
      </ul>
    </details>
  );
}

export function DesktopNavigation({ items = navigation }: DesktopNavigationProps) {
  return (
    <nav className="desktop-navigation" aria-label="Päänavigaatio">
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <NavigationBranch item={item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
