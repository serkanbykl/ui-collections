import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsConnectionsScreen } from "@/registry/kit/screens/screen-settings-connections";

export default function ScreenSettingsConnectionsDemo() {
  return (
    <AppShell title="Connections">
      <SettingsConnectionsScreen />
    </AppShell>
  );
}
