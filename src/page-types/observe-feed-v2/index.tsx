// Page type (v2 working copy): Observe feed (Sanity type `observePage`).
import { withShell } from "../../shell/SiteShell";
import { ObserveFeedV2, type ObserveFeedV2Content } from "./ObserveFeedV2";

export type { ObserveFeedV2Content };
export default withShell<ObserveFeedV2Content>(ObserveFeedV2);
