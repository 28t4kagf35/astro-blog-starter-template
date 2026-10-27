// Page type (v4 working copy): Culture & History as a phone-first story pager (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureFeedV4, type CultureFeedV4Content } from "./CultureFeedV4";

export type { CultureFeedV4Content };
export default withShell<CultureFeedV4Content>(CultureFeedV4);
