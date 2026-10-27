import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsApiScreen } from "@/registry/kit/screens/screen-settings-api";

export default function ScreenSettingsApiDemo() {
  return (
    <AppShell title="API & webhooks">
      <SettingsApiScreen />
    </AppShell>
  );
}
