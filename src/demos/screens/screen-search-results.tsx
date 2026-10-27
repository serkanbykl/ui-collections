import { AppShell } from "@/registry/kit/blocks/app-shell";
import { SearchResultsScreen } from "@/registry/kit/screens/screen-search-results";

export default function ScreenSearchResultsDemo() {
  return (
    <AppShell title="Search">
      <SearchResultsScreen />
    </AppShell>
  );
}
