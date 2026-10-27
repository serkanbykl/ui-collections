import type { DemoMap } from "../types";
import ActivityListDemo from "./activity-list";
import ChoiceCardGroupDemo from "./choice-card-group";
import ComboboxDemo from "./combobox";
import DataTableDemo from "./data-table";
import DateRangePickerDemo from "./date-range-picker";
import EntityCardDemo from "./entity-card";
import FilterBarDemo from "./filter-bar";
import MultiSelectDemo from "./multi-select";
import ProgressListDemo from "./progress-list";
import SearchInputDemo from "./search-input";
import StatCardDemo from "./stat-card";
import StatesDemo from "./states";

export const patternDemos: DemoMap = {
  "data-table": DataTableDemo,
  "filter-bar": FilterBarDemo,
  "search-input": SearchInputDemo,
  "multi-select": MultiSelectDemo,
  combobox: ComboboxDemo,
  "date-range-picker": DateRangePickerDemo,
  "choice-card-group": ChoiceCardGroupDemo,
  "stat-card": StatCardDemo,
  "progress-list": ProgressListDemo,
  "activity-list": ActivityListDemo,
  "entity-card": EntityCardDemo,
  states: StatesDemo,
};
