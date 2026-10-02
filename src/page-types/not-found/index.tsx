// Page type: Not found (the 404 page).
import { withShell } from "../../shell/SiteShell";
import { NotFound, type NotFoundContent } from "./NotFound";

export type { NotFoundContent };
export default withShell<NotFoundContent>(NotFound);
