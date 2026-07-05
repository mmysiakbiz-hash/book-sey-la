import SearchPage from "@/components/sections/SearchPage";
import { getStudios } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function Page(){
  const studios = await getStudios();
  return <SearchPage studios={studios}/>;
}
