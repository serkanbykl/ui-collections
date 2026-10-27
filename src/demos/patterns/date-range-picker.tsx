"use client";

import { useState } from "react";

import { DateRangePicker, type DateRange } from "@/registry/kit/ui/date-range-picker";

// A fixed "today" keeps server and client output identical.
const today = new Date(2026, 9, 26);

export default function DateRangePickerDemo() {
  const [range, setRange] = useState<DateRange>({ from: new Date(2026, 9, 20), to: today });

  return <DateRangePicker value={range} onValueChange={setRange} today={today} />;
}
