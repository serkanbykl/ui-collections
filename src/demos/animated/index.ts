import type { DemoMap } from "../types";
import AuroraBackdropDemo from "./aurora-backdrop";
import DockDemo from "./dock";
import DynamicIslandDemo from "./dynamic-island";
import ExpandableCardDemo from "./expandable-card";
import FluidTabsDemo from "./fluid-tabs";
import HoldToConfirmDemo from "./hold-to-confirm";
import InlineEditDemo from "./inline-edit";
import LiveIndicatorDemo from "./live-indicator";
import MagneticDemo from "./magnetic";
import MarqueeDemo from "./marquee";
import MorphingButtonDemo from "./morphing-button";
import NumberTickerDemo from "./number-ticker";
import ScrollProgressDemo from "./scroll-progress";
import ScrollTextRevealDemo from "./scroll-text-reveal";
import ScrubSliderDemo from "./scrub-slider";
import ShimmerTextDemo from "./shimmer-text";
import SpotlightCardDemo from "./spotlight-card";
import StepperDemo from "./stepper";
import TextRevealDemo from "./text-reveal";
import TiltCardDemo from "./tilt-card";
import TypewriterDemo from "./typewriter";
import VideoBackdropDemo from "./video-backdrop";

export const animatedDemos: DemoMap = {
  "text-reveal": TextRevealDemo,
  magnetic: MagneticDemo,
  "spotlight-card": SpotlightCardDemo,
  marquee: MarqueeDemo,
  "number-ticker": NumberTickerDemo,
  "video-backdrop": VideoBackdropDemo,
  "aurora-backdrop": AuroraBackdropDemo,
  dock: DockDemo,
  "dynamic-island": DynamicIslandDemo,
  "morphing-button": MorphingButtonDemo,
  "fluid-tabs": FluidTabsDemo,
  "expandable-card": ExpandableCardDemo,
  stepper: StepperDemo,
  "hold-to-confirm": HoldToConfirmDemo,
  "shimmer-text": ShimmerTextDemo,
  "inline-edit": InlineEditDemo,
  "scrub-slider": ScrubSliderDemo,
  "tilt-card": TiltCardDemo,
  typewriter: TypewriterDemo,
  "live-indicator": LiveIndicatorDemo,
  "scroll-progress": ScrollProgressDemo,
  "scroll-text-reveal": ScrollTextRevealDemo,
};
