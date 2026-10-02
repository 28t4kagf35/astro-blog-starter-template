// Page type: Activity (Sanity type `activity`).
import { withShell } from "../../shell/SiteShell";
import { Activity, type ActivityContent } from "./Activity";

export type { ActivityContent };
export default withShell<ActivityContent>(Activity);
