import { AppShell } from "@/registry/kit/blocks/app-shell";
import { UserProfileScreen } from "@/registry/kit/screens/screen-user-profile";

export default function ScreenUserProfileDemo() {
  return (
    <AppShell title="Profile">
      <UserProfileScreen />
    </AppShell>
  );
}
