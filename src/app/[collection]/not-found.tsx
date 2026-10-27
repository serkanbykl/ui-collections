
import { SiteLink as Link } from "@/components/site/site-link";
import { buttonVariants } from "@/registry/kit/ui/button";

export default function NotFound() {
  return (
    <main id="main" className="grid min-h-dvh place-items-center px-6 py-20 text-center">
      <div className="max-w-md">
        <p className="font-display text-7xl text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl">We couldn&apos;t find that page.</h1>
        <p className="mt-4 leading-relaxed text-muted">
          The link may be old or mistyped. Everything in the library is one click away.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className={buttonVariants({ variant: "solid" })}>
            Back to home
          </Link>
          <Link href="/components" className={buttonVariants()}>
            Browse components
          </Link>
        </div>
      </div>
    </main>
  );
}
