import { AppShell } from "@/registry/kit/blocks/app-shell";
import { NotesScreen } from "@/registry/kit/screens/screen-notes";

export default function ScreenNotesDemo() {
  return (
    <AppShell title="Notes">
      <NotesScreen />
    </AppShell>
  );
}
