import { DocsShell } from "@/components/site/docs-shell";

export default function CategoryLayout({ children }: LayoutProps<"/[collection]/[category]">) {
  return <DocsShell>{children}</DocsShell>;
}
