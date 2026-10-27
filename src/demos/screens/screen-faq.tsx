import { AppShell } from "@/registry/kit/blocks/app-shell";
import { FaqScreen } from "@/registry/kit/screens/screen-faq";

export default function ScreenFaqDemo() {
  return (
    <AppShell title="FAQ">
      <FaqScreen />
    </AppShell>
  );
}
