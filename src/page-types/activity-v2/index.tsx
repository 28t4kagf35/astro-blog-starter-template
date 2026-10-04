// Page type (v2 working copy): ActivityV2 (Sanity type `activity`).
import { withShell } from "../../shell/SiteShell";
import { ActivityV2, type ActivityV2Content } from "./ActivityV2";

export type { ActivityV2Content };
export default withShell<ActivityV2Content>(ActivityV2);
