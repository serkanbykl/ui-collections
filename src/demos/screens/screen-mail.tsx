import { AppShell } from "@/registry/kit/blocks/app-shell";
import { MailScreen } from "@/registry/kit/screens/screen-mail";

export default function ScreenMailDemo() {
  return (
    <AppShell title="Mail">
      <MailScreen />
    </AppShell>
  );
}
