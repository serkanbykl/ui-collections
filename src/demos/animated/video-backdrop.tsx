import { media } from "@/lib/site";
import { VideoBackdrop } from "@/registry/kit/ui/video-backdrop";

export default function VideoBackdropDemo() {
  return (
    // The scrim is always dark, so type over it uses the dark-mode tokens.
    <div data-mode="dark" className="relative isolate grid aspect-video w-full max-w-2xl place-items-center overflow-hidden rounded-card">
      <VideoBackdrop src={media.aurora.src} poster={media.aurora.poster} scrim="strong" />
      <p className="font-display text-4xl text-fg md:text-5xl">Plays only when seen.</p>
    </div>
  );
}
