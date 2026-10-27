import { ScrubSlider } from "@/registry/kit/ui/scrub-slider";

export default function ScrubSliderDemo() {
  return (
    <div className="grid w-full max-w-sm gap-3">
      <ScrubSlider label="Exposure" defaultValue={0.4} min={-2} max={2} step={0.1} unit=" ev" />
      <ScrubSlider label="Warmth" defaultValue={62} unit="%" />
      <ScrubSlider label="Grain" defaultValue={18} max={50} />
    </div>
  );
}
