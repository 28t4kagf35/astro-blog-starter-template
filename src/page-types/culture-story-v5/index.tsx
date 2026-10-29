// Page type (v5 working copy): one Culture & History story on its own address (Sanity type `cultureArticle`).
import { withShell } from "../../shell/SiteShell";
import { CultureStoryV5, type CultureStoryV5Content } from "./CultureStoryV5";

export type { CultureStoryV5Content };
export default withShell<CultureStoryV5Content>(CultureStoryV5);
