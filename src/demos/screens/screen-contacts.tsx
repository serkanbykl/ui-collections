import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ContactsScreen } from "@/registry/kit/screens/screen-contacts";

export default function ScreenContactsDemo() {
  return (
    <AppShell title="Contacts">
      <ContactsScreen />
    </AppShell>
  );
}
