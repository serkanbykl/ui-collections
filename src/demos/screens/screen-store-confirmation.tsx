"use client";

import { StoreConfirmationScreen } from "@/registry/kit/screens/screen-store-confirmation";

import { StoreDemoFrame } from "./store-frame";

export default function ScreenStoreConfirmationDemo() {
  return <StoreDemoFrame>{() => <StoreConfirmationScreen />}</StoreDemoFrame>;
}
