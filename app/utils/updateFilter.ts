export function updateFilter(
  searchParams: URLSearchParams,
  filter: "category" | "stock",
  value: string,
) {
  const params = new URLSearchParams(searchParams.toString());

  if (value) {
    params.set(filter, value);
  } else {
    params.delete(filter);
  }

  params.delete("page");

  return params;
}
