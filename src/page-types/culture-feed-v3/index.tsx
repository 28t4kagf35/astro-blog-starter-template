// Page type (v3 working copy): Culture & History as a phone-first story pager (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureFeedV3, type CultureFeedV3Content } from "./CultureFeedV3";

export type { CultureFeedV3Content };
export default withShell<CultureFeedV3Content>(CultureFeedV3);
