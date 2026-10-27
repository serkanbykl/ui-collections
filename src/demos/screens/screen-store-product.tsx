"use client";

import { StoreProductScreen } from "@/registry/kit/screens/screen-store-product";

import { StoreDemoFrame } from "./store-frame";

export default function ScreenStoreProductDemo() {
  return <StoreDemoFrame>{({ add }) => <StoreProductScreen onAddToCart={add} />}</StoreDemoFrame>;
}
