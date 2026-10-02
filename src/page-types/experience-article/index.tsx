// Page type: Experience article (Sanity type `experienceArticle`).
import { withShell } from "../../shell/SiteShell";
import { ExperienceArticle, type ExperienceArticleContent } from "./ExperienceArticle";

export type { ExperienceArticleContent };
export default withShell<ExperienceArticleContent>(ExperienceArticle);
