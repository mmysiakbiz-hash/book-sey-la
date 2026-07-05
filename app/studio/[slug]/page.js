import VenueHero from "@/components/sections/VenueHero";
import VenueServices from "@/components/sections/VenueServices";
import VenueShowcase from "@/components/sections/VenueShowcase";
import VenueClose from "@/components/sections/VenueClose";
import { getStudioBySlug } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function StudioPage({ params }){
  const studio = await getStudioBySlug(params.slug);
  return(<><VenueHero studio={studio}/><main><VenueServices studio={studio}/><VenueShowcase studio={studio}/><VenueClose studio={studio}/></main></>);
}
