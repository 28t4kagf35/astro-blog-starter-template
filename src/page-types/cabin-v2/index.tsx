// Page type: The Cabin v2 (working copy, shown at /cabin-v2 beside the original).
import { withShell } from "../../shell/SiteShell";
import { CabinV2, type CabinV2Content } from "./CabinV2";

export type { CabinV2Content };
export default withShell<CabinV2Content>(CabinV2);
