import { permanentRedirect } from "next/navigation";

export default function RootPage(): never {
  permanentRedirect("/fi");
}
