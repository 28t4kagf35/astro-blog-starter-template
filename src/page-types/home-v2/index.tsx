// Page type: Home v2 (working copy, shown at /home-v2 beside the original).
import { withShell } from "../../shell/SiteShell";
import { HomeV2, type HomeV2Content } from "./HomeV2";

export type { HomeV2Content };
export default withShell<HomeV2Content>(HomeV2);
