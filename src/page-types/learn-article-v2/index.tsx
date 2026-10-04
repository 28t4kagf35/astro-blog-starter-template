// Page type: Learn v2 (working copy, shown at /learn-v2 beside the original).
import { withShell } from "../../shell/SiteShell";
import { LearnV2, type LearnV2Content } from "./LearnV2";

export type { LearnV2Content };
export default withShell<LearnV2Content>(LearnV2);
