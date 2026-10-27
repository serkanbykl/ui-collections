import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsNotificationsScreen } from "@/registry/kit/screens/screen-settings-notifications";

export default function ScreenSettingsNotificationsDemo() {
  return (
    <AppShell title="Notifications">
      <SettingsNotificationsScreen />
    </AppShell>
  );
}
