import SearchPage from "@/components/sections/SearchPage";
import { getStudios } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }){
  const studios = await getStudios();
  const initialCat = searchParams && typeof searchParams.cat === "string" ? searchParams.cat : "";
  return <SearchPage studios={studios} initialCat={initialCat}/>;
}
