// Kit is the breastfeeding tracker's marketing name. Article and support titles keep
// their keyword first and gain the brand only when the whole title still fits in the
// 60 characters search results usually show.
export const kitBrandName = "Kit";

const kitTitleSuffix = ` | ${kitBrandName}`;
const maximumSearchTitleLength = 60;

export function withKitBrand(title) {
  const branded = `${title}${kitTitleSuffix}`;
  return branded.length <= maximumSearchTitleLength ? branded : title;
}
