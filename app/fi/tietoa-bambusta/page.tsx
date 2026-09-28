import type { Metadata } from "next";

import { InformationHubView } from "@/components/content";
import {
  getPublishedInformationHub,
  getPublishedInformationPages,
} from "@/data/content";
import { createPageMetadata } from "@/lib/seo";

const informationHub = getPublishedInformationHub();

export const metadata: Metadata = createPageMetadata({
  title: informationHub.title,
  description: informationHub.metaDescription,
  path: informationHub.path,
  indexable: true,
});

export default function InformationHubPage() {
  return (
    <InformationHubView
      hub={informationHub}
      pages={getPublishedInformationPages()}
    />
  );
}
