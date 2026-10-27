import { AppShell } from "@/registry/kit/blocks/app-shell";
import { HelpCenterScreen } from "@/registry/kit/screens/screen-help-center";

export default function ScreenHelpCenterDemo() {
  return (
    <AppShell title="Help center">
      <HelpCenterScreen />
    </AppShell>
  );
}
