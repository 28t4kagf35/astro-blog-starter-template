// Page type: The Cabin (Sanity type `cabinPage`).
import { withShell } from "../../shell/SiteShell";
import { Cabin, type CabinContent } from "./Cabin";

export type { CabinContent };
export default withShell<CabinContent>(Cabin);
