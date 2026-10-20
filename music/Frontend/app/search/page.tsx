import SearchContent from "@/components/SearchContent";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  return <SearchContent initialQuery={q} />;
}
