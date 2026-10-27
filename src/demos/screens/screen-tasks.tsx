import { AppShell } from "@/registry/kit/blocks/app-shell";
import { TasksScreen } from "@/registry/kit/screens/screen-tasks";

export default function ScreenTasksDemo() {
  return (
    <AppShell title="Tasks">
      <TasksScreen />
    </AppShell>
  );
}
