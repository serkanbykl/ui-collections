"use client";

import { StoreCheckoutScreen } from "@/registry/kit/screens/screen-store-checkout";

import { StoreDemoFrame } from "./store-frame";

export default function ScreenStoreCheckoutDemo() {
  return <StoreDemoFrame checkout>{({ lines }) => <StoreCheckoutScreen lines={lines} promoCode="AUTUMN15" />}</StoreDemoFrame>;
}
