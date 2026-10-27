import { AppShell } from "@/registry/kit/blocks/app-shell";
import { UsersScreen } from "@/registry/kit/screens/screen-users";

export default function ScreenUsersDemo() {
  return (
    <AppShell title="Users">
      <UsersScreen />
    </AppShell>
  );
}
