import { collection } from "next/root-params";

import { ThemeDock } from "@/components/site/theme-settings";
import { getCollection } from "@/collections";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const c = getCollection(await collection());
  return (
    <>
      {children}
      <ThemeDock collection={c.id} />
    </>
  );
}
