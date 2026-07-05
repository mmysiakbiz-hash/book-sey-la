import VenueHero from "@/components/sections/VenueHero";
import VenueServices from "@/components/sections/VenueServices";
import VenueClasses from "@/components/sections/VenueClasses";
import VenueShowcase from "@/components/sections/VenueShowcase";
import VenueClose from "@/components/sections/VenueClose";
import { getStudioBySlug, getStudioClasses } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function StudioPage({ params }){
  const studio = await getStudioBySlug(params.slug);
  const classes = studio ? await getStudioClasses(studio.id) : [];
  return(<><VenueHero studio={studio} hasClasses={classes.length > 0}/><main><VenueServices studio={studio}/><VenueClasses classes={classes}/><VenueShowcase studio={studio}/><VenueClose studio={studio}/></main></>);
}
