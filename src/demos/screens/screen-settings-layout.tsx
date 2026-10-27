import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SettingsLayout, SettingsSection } from "@/registry/kit/screens/settings-layout";

export default function ScreenSettingsLayoutDemo() {
  return (
    <AppShell title="Settings">
      <SettingsLayout active="general" title="General" description="Every settings page shares this frame: a title, the section menu and its cards.">
        <SettingsSection title="Workspace name" description="Shown in the sidebar and on invoices.">
          <p className="text-sm text-muted">Northwind</p>
        </SettingsSection>
        <SettingsSection title="Workspace URL" description="People use it to sign in.">
          <p className="font-mono text-sm text-muted">northwind.lumen.dev</p>
        </SettingsSection>
        <SettingsSection tone="danger" title="Delete workspace" description="Removes every project, file and member. This can't be undone." />
      </SettingsLayout>
    </AppShell>
  );
}
