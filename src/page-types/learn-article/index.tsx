// Page type: Learn article (Sanity type `learnArticle`).
import { withShell } from "../../shell/SiteShell";
import { LearnArticle, type LearnArticleContent } from "./LearnArticle";

export type { LearnArticleContent };
export default withShell<LearnArticleContent>(LearnArticle);
