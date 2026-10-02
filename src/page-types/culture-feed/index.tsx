// Page type: Culture & History snack-card feed (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureFeed, type CultureFeedContent } from "./CultureFeed";

export type { CultureFeedContent };
export default withShell<CultureFeedContent>(CultureFeed);
