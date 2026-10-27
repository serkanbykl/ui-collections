import type { DemoMap } from "../types";
import ScreenMailDemo from "./screen-mail";
import ScreenChatDemo from "./screen-chat";
import ScreenCalendarDemo from "./screen-calendar";
import ScreenKanbanDemo from "./screen-kanban";
import ScreenTasksDemo from "./screen-tasks";
import ScreenNotesDemo from "./screen-notes";
import ScreenFileManagerDemo from "./screen-file-manager";
import ScreenContactsDemo from "./screen-contacts";

export const appsScreenDemos: DemoMap = {
  "screen-mail": ScreenMailDemo,
  "screen-chat": ScreenChatDemo,
  "screen-calendar": ScreenCalendarDemo,
  "screen-kanban": ScreenKanbanDemo,
  "screen-tasks": ScreenTasksDemo,
  "screen-notes": ScreenNotesDemo,
  "screen-file-manager": ScreenFileManagerDemo,
  "screen-contacts": ScreenContactsDemo,
};
