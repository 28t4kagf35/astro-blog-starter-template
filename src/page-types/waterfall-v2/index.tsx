// Page type (v2 working copy): waterfall detail with a placement line in the hero.
import { withShell } from "../../shell/SiteShell";
import { WaterfallV2, type WaterfallV2Content } from "./WaterfallV2";

export type { WaterfallV2Content };
export default withShell<WaterfallV2Content>(WaterfallV2);
