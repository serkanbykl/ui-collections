import { AppShell } from "@/registry/kit/blocks/app-shell";
import { TeamScreen } from "@/registry/kit/screens/screen-team";

export default function ScreenTeamDemo() {
  return (
    <AppShell title="Team">
      <TeamScreen />
    </AppShell>
  );
}
