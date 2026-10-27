import Link from "next/link";

import { collectionOrigin } from "@/collections";
import { HamsiPond } from "@/components/pond/hamsi-pond";

export default function HomeNotFound() {
  return (
    <div className="relative min-h-dvh">
      <HamsiPond />
      <main id="main" className="pointer-events-none relative z-20 flex min-h-dvh flex-col justify-end gap-4 px-6 pb-16 lg:px-[16vw] lg:pb-24">
        <div data-hamsi-avoid className="pointer-events-auto flex max-w-xl flex-col gap-3 text-[15px] leading-[1.7]">
          <p className="text-[13px] text-(--ink-soft)">404</p>
          <h1 className="text-balance">Nothing swims at this address.</h1>
          <p className="text-pretty text-(--ink-soft)">
            Components, blocks and templates live in each collection. Open one of them, or go back to the deep.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
            <Link href="/" className="underline decoration-(--rule) underline-offset-[5px] hover:decoration-(--ink)">Back to the deep</Link>
            <a href={collectionOrigin("glass")} className="underline decoration-(--rule) underline-offset-[5px] hover:decoration-(--ink)">Open glass</a>
            <a href={collectionOrigin("tide")} className="underline decoration-(--rule) underline-offset-[5px] hover:decoration-(--ink)">Open tide</a>
          </p>
        </div>
      </main>
    </div>
  );
}
