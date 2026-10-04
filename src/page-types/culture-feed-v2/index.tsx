// Page type (v2 working copy): Culture & History snack-card feed (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureFeedV2, type CultureFeedV2Content } from "./CultureFeedV2";

export type { CultureFeedV2Content };
export default withShell<CultureFeedV2Content>(CultureFeedV2);
