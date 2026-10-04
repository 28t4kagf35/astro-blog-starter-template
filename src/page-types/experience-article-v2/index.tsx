// Page type: Experience v2 (working copy, shown at /experience-v2 beside the original).
import { withShell } from "../../shell/SiteShell";
import { ExperienceV2, type ExperienceV2Content } from "./ExperienceV2";

export type { ExperienceV2Content };
export default withShell<ExperienceV2Content>(ExperienceV2);
