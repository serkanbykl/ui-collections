import { AppShell } from "@/registry/kit/blocks/app-shell";
import { CalendarScreen } from "@/registry/kit/screens/screen-calendar";

export default function ScreenCalendarDemo() {
  return (
    <AppShell title="Calendar">
      <CalendarScreen />
    </AppShell>
  );
}
