import type { ComponentType } from "react";

/**
 * Demo components keyed by catalog slug. A demo lives at
 * src/demos/<category>/<slug>.tsx and doubles as the usage example in the docs.
 */
export type DemoMap = Record<string, ComponentType>;
