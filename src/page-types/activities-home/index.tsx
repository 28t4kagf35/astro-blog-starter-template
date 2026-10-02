// Page type: Activities home.
import { withShell } from "../../shell/SiteShell";
import { ActivitiesHome, type ActivitiesHomeContent } from "./ActivitiesHome";

export type { ActivitiesHomeContent };
export default withShell<ActivitiesHomeContent>(ActivitiesHome);
