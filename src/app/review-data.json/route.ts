import { staticSite } from "@site/content/static";
import { buildReviewData } from "@site/site/reviewData";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildReviewData(staticSite, ""));
}
