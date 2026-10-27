import { AppShell } from "@/registry/kit/blocks/app-shell";
import { HelpArticleScreen } from "@/registry/kit/screens/screen-help-article";

export default function ScreenHelpArticleDemo() {
  return (
    <AppShell title="Help center">
      <HelpArticleScreen />
    </AppShell>
  );
}
