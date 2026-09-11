import type { LocalPath } from "@/data";

import type { MediaAsset } from "../media/responsive-media";
import { ResponsiveMedia } from "../media/responsive-media";

export type GalleryItem = Readonly<{
  id: string;
  image: MediaAsset | null;
  alt: string;
  caption?: string;
  href?: LocalPath;
}>;

export type GalleryGridProps = Readonly<{
  items: readonly GalleryItem[];
}>;

export function GalleryTile({ item }: Readonly<{ item: GalleryItem }>) {
  const media = (
    <ResponsiveMedia
      className="gallery-tile__media"
      image={item.image}
      placeholderAlt={item.alt}
      sizes="(min-width: 75rem) 18rem, (min-width: 48rem) 50vw, 50vw"
    />
  );

  return (
    <figure className="gallery-tile">
      {item.href ? <a href={item.href}>{media}</a> : media}
      {item.caption ? <figcaption>{item.caption}</figcaption> : null}
    </figure>
  );
}

export function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="gallery-grid">
      {items.map((item) => (
        <GalleryTile item={item} key={item.id} />
      ))}
    </div>
  );
}
