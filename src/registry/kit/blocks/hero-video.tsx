import { ButtonShine, buttonVariants } from "@/registry/kit/ui/button";
import { Reveal, TextReveal } from "@/registry/kit/ui/reveal";
import { VideoBackdrop } from "@/registry/kit/ui/video-backdrop";

// Defaults point at an abstract loop served from your own /public/media folder;
// pass your own footage via `videoSrc` and `poster`. Use only video you hold
// the rights to.
const defaultVideo = "/media/aurora-loop.mp4";
const defaultPoster = "/media/aurora-loop.jpg";

export interface HeroVideoProps {
  videoSrc?: string;
  poster?: string;
  title?: string;
  description?: string;
  action?: { label: string; href: string };
}

export function HeroVideo({
  videoSrc = defaultVideo,
  poster = defaultPoster,
  title = "Write the code. We'll handle the rest.",
  description = "Previews for every branch, rollbacks in one click and logs you can actually read.",
  action = { label: "Deploy your first app", href: "/signup" },
}: HeroVideoProps) {
  return (
    // Copy sits on a darkened video, so this section is always in dark mode.
    <section data-mode="dark" className="relative isolate flex min-h-[40rem] items-end overflow-hidden bg-bg-deep text-fg">
      <VideoBackdrop src={videoSrc} poster={poster} scrim="strong" priority />
      <div className="mx-auto w-full max-w-7xl px-6 pt-40 pb-16 md:px-8 md:pb-20">
        <TextReveal
          as="h1"
          className="max-w-3xl font-display text-[clamp(2.75rem,7vw,5.75rem)] leading-[0.95]"
        >
          {title}
        </TextReveal>
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Reveal as="p" trigger="load" delay={350} className="max-w-md text-lg leading-relaxed text-fg/75">
            {description}
          </Reveal>
          <Reveal trigger="load" delay={500}>
            <a href={action.href} className={buttonVariants({ size: "lg" })}>
              <ButtonShine />
              {action.label}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
