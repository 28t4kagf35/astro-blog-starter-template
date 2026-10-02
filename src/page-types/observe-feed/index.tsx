// Page type: Observe feed (Sanity type `observePage`).
import { withShell } from "../../shell/SiteShell";
import { ObserveFeed, type ObserveFeedContent } from "./ObserveFeed";

export type { ObserveFeedContent };
export default withShell<ObserveFeedContent>(ObserveFeed);
