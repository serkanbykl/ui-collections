import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsSecurityScreen } from "@/registry/kit/screens/screen-settings-security";

export default function ScreenSettingsSecurityDemo() {
  return (
    <AppShell title="Security">
      <SettingsSecurityScreen />
    </AppShell>
  );
}
