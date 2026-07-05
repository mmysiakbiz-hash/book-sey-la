import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import Categories from "@/components/sections/Categories";
import PhotoStrip from "@/components/sections/PhotoStrip";
import FeaturedStudios from "@/components/sections/FeaturedStudios";
import HowItWorks from "@/components/sections/HowItWorks";
import Trust from "@/components/sections/Trust";
import FinalCTA from "@/components/sections/FinalCTA";
import { getStudios } from "@/lib/studios";

export const dynamic = "force-dynamic";

export default async function HomePage(){
  const studios = await getStudios();
  return(<><Nav/><main><Hero/><Categories/><PhotoStrip caption="Island studios, real calm"/><FeaturedStudios studios={studios}/><HowItWorks/><Trust/><FinalCTA/></main></>);
}
