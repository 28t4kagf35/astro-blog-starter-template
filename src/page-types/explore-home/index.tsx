// Page type: Explore home.
import { withShell } from "../../shell/SiteShell";
import { ExploreHome, type ExploreHomeContent } from "./ExploreHome";

export type { ExploreHomeContent };
export default withShell<ExploreHomeContent>(ExploreHome);
