import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsGeneralScreen } from "@/registry/kit/screens/screen-settings-general";

export default function ScreenSettingsGeneralDemo() {
  return (
    <AppShell title="Settings">
      <SettingsGeneralScreen />
    </AppShell>
  );
}
