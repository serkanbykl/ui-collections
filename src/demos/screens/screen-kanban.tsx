import { AppShell } from "@/registry/kit/blocks/app-shell";
import { KanbanScreen } from "@/registry/kit/screens/screen-kanban";

export default function ScreenKanbanDemo() {
  return (
    <AppShell title="Board">
      <KanbanScreen />
    </AppShell>
  );
}
