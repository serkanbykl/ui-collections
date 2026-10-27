import { AppShell } from "@/registry/kit/blocks/app-shell";
import { ChatScreen } from "@/registry/kit/screens/screen-chat";

export default function ScreenChatDemo() {
  return (
    <AppShell title="Chat">
      <ChatScreen />
    </AppShell>
  );
}
