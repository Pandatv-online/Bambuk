import Image from "next/image";

import type { LocalPath } from "@/data";

import { classNames } from "../ui/class-names";

export type MediaAsset = Readonly<{
  src: LocalPath;
  alt: string;
  rightsId: string;
}>;

export type ResponsiveMediaProps = Readonly<{
  image: MediaAsset | null;
  placeholderAlt: string;
  className?: string;
  sizes?: string;
  preload?: boolean;
}>;

export function ResponsiveMedia({
  className,
  image,
  placeholderAlt,
  preload = false,
  sizes = "(min-width: 75rem) 36rem, (min-width: 48rem) 50vw, 100vw",
}: ResponsiveMediaProps) {
  if (!image) {
    return (
      <div
        className={classNames("responsive-media responsive-media--placeholder", className)}
        role="img"
        aria-label={placeholderAlt}
      >
        <span aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={classNames("responsive-media", className)}>
      <Image
        alt={image.alt}
        fill
        preload={preload}
        sizes={sizes}
        src={image.src}
      />
    </div>
  );
}
