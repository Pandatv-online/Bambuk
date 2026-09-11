import type { LocalPath, NavigationItem } from "@/data";
import { navigation } from "@/data";

export type BreadcrumbsProps = Readonly<{
  currentPath: LocalPath;
  items?: readonly NavigationItem[];
}>;

function getBreadcrumbTrail(
  currentPath: LocalPath,
  items: readonly NavigationItem[] = navigation,
): readonly NavigationItem[] {
  for (const item of items) {
    if (item.href === currentPath) return [item];
    const descendants = item.children
      ? getBreadcrumbTrail(currentPath, item.children)
      : [];
    if (descendants.length) return [item, ...descendants];
  }
  return [];
}

export function Breadcrumbs({ currentPath, items = navigation }: BreadcrumbsProps) {
  if (currentPath === "/fi") return null;

  const trail = getBreadcrumbTrail(currentPath, items);
  if (!trail.length) return null;

  return (
    <nav className="breadcrumbs" aria-label="Murupolku">
      <ol>
        <li>
          <a href="/fi">Koti</a>
        </li>
        {trail.map((item, index) => {
          const isCurrent = index === trail.length - 1;
          return (
            <li key={item.id}>
              {isCurrent ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <a href={item.href}>{item.label}</a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
