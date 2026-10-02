// Page type: Home (Sanity type `homePage`).
import { withShell } from "../../shell/SiteShell";
import { Home, type HomeContent } from "./Home";

export type { HomeContent };
export default withShell<HomeContent>(Home);
