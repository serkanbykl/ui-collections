"use client";

import { StoreScreen, sampleStoreCollections } from "@/registry/kit/screens/screen-store";

import { StoreDemoFrame } from "./store-frame";

export default function ScreenStoreDemo() {
  return <StoreDemoFrame>{({ add }) => <StoreScreen onAddToCart={add} collections={sampleStoreCollections} />}</StoreDemoFrame>;
}
