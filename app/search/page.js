import SearchPage from "@/components/sections/SearchPage";
import { getStudios } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }){
  const studios = await getStudios();
  const str = (v) => (typeof v === "string" ? v : "");
  const initialCat = str(searchParams?.cat);
  const initialQ = str(searchParams?.q);
  const initialLoc = str(searchParams?.loc);
  return <SearchPage studios={studios} initialCat={initialCat} initialQ={initialQ} initialLoc={initialLoc}/>;
}
