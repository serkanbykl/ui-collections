import { AppShell } from "@/registry/kit/blocks/app-shell";
import { FileManagerScreen } from "@/registry/kit/screens/screen-file-manager";

export default function ScreenFileManagerDemo() {
  return (
    <AppShell title="Files">
      <FileManagerScreen />
    </AppShell>
  );
}
