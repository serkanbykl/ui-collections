import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsBillingScreen } from "@/registry/kit/screens/screen-settings-billing";

export default function ScreenSettingsBillingDemo() {
  return (
    <AppShell title="Billing">
      <SettingsBillingScreen />
    </AppShell>
  );
}
