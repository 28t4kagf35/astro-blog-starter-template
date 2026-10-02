// Page type: Waterfalls Master Guide (Sanity type `masterGuide`).
import { withShell } from "../../shell/SiteShell";
import { WaterfallsMasterGuideAligned, type MasterGuideContent } from "./MasterGuide";

export type { MasterGuideContent };
export default withShell<MasterGuideContent>(WaterfallsMasterGuideAligned);
