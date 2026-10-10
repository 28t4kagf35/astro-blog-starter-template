// Page type (v3 working copy): Observe as a calm, Instagram-like feed with hearts and sharing (Sanity type `observePage`).
import { withShell } from "../../shell/SiteShell";
import { ObserveFeedV3, type ObserveFeedV3Content } from "./ObserveFeedV3";

export type { ObserveFeedV3Content };
export default withShell<ObserveFeedV3Content>(ObserveFeedV3);
