// Page type (v5 working copy): Culture & History as a phone-first story pager (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureFeedV5, type CultureFeedV5Content } from "./CultureFeedV5";

export type { CultureFeedV5Content };
export default withShell<CultureFeedV5Content>(CultureFeedV5);
