import VenueHero from "@/components/sections/VenueHero";
import VenueServices from "@/components/sections/VenueServices";
import VenueClasses from "@/components/sections/VenueClasses";
import VenueWaitlist from "@/components/sections/VenueWaitlist";
import VenueShowcase from "@/components/sections/VenueShowcase";
import VenueClose from "@/components/sections/VenueClose";
import { getStudioBySlug, getStudioClasses } from "@/lib/studios";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function StudioPage({ params }){
  const studio = await getStudioBySlug(params.slug);
  if (!studio) notFound(); // no demo fallback — a missing studio is a real 404
  const classes = await getStudioClasses(studio.id);
  const bookable = studio && !studio.unclaimed;
  return(<><VenueHero studio={studio} hasClasses={classes.length > 0}/><main><VenueServices studio={studio}/><VenueClasses classes={classes}/>{bookable && <VenueWaitlist studioId={studio.id}/>}<VenueShowcase studio={studio}/><VenueClose studio={studio}/></main></>);
}
