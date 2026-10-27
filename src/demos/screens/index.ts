import type { DemoMap } from "../types";
import { accountScreenDemos } from "./account";
import { appsScreenDemos } from "./apps";
import { commerceScreenDemos } from "./commerce";

export const screenDemos: DemoMap = { ...appsScreenDemos, ...commerceScreenDemos, ...accountScreenDemos };
