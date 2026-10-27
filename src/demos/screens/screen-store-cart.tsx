"use client";

import { StoreCartScreen } from "@/registry/kit/screens/screen-store-cart";

import { StoreDemoFrame } from "./store-frame";

export default function ScreenStoreCartDemo() {
  return <StoreDemoFrame>{({ lines, setLines }) => <StoreCartScreen lines={lines} onLinesChange={setLines} />}</StoreDemoFrame>;
}
