import type { DemoMap } from "../types";
import ScreenSettingsLayoutDemo from "./screen-settings-layout";
import ScreenUsersDemo from "./screen-users";
import ScreenUserProfileDemo from "./screen-user-profile";
import ScreenRolesDemo from "./screen-roles";
import ScreenTeamDemo from "./screen-team";
import ScreenSettingsGeneralDemo from "./screen-settings-general";
import ScreenSettingsSecurityDemo from "./screen-settings-security";
import ScreenSettingsNotificationsDemo from "./screen-settings-notifications";
import ScreenSettingsBillingDemo from "./screen-settings-billing";
import ScreenSettingsApiDemo from "./screen-settings-api";
import ScreenSettingsConnectionsDemo from "./screen-settings-connections";
import ScreenHelpCenterDemo from "./screen-help-center";
import ScreenHelpArticleDemo from "./screen-help-article";
import ScreenFaqDemo from "./screen-faq";
import ScreenSearchResultsDemo from "./screen-search-results";
import ScreenTimelineDemo from "./screen-timeline";

export const accountScreenDemos: DemoMap = {
  "screen-users": ScreenUsersDemo,
  "screen-user-profile": ScreenUserProfileDemo,
  "screen-roles": ScreenRolesDemo,
  "screen-team": ScreenTeamDemo,
  "screen-settings-layout": ScreenSettingsLayoutDemo,
  "screen-settings-general": ScreenSettingsGeneralDemo,
  "screen-settings-security": ScreenSettingsSecurityDemo,
  "screen-settings-notifications": ScreenSettingsNotificationsDemo,
  "screen-settings-billing": ScreenSettingsBillingDemo,
  "screen-settings-api": ScreenSettingsApiDemo,
  "screen-settings-connections": ScreenSettingsConnectionsDemo,
  "screen-help-center": ScreenHelpCenterDemo,
  "screen-help-article": ScreenHelpArticleDemo,
  "screen-faq": ScreenFaqDemo,
  "screen-search-results": ScreenSearchResultsDemo,
  "screen-timeline": ScreenTimelineDemo,
};
