import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const bundlePath = join("site-copy", "assets", "index-CNBNs70h.js");
let bundle = await readFile(bundlePath, "utf8");

const aggregateRating = 'ratingValue:xg,ratingCount:vg,bestRating:"5",worstRating:"1",reviewCount:vg';
const aggregateRatingWithReviewedItem =
  'ratingValue:xg,ratingCount:vg,bestRating:"5",worstRating:"1",reviewCount:vg,itemReviewed:{"@type":"LocalBusiness",name:"Purely Canadian Movers",url:"https://www.purelycanadianmovers.com",description:"Professional moving services in Vancouver and across Canada",telephone:"1-877-485-6683"}';

if (bundle.includes(aggregateRatingWithReviewedItem)) {
  console.log("Homepage Google Reviews schema already matches the live site.");
} else if (!bundle.includes(aggregateRating)) {
  throw new Error("Could not find homepage Google Reviews aggregate rating schema.");
} else {
  bundle = bundle.replace(aggregateRating, aggregateRatingWithReviewedItem);
  await writeFile(bundlePath, bundle);
  console.log("Patched homepage Google Reviews schema to match the live site.");
}
