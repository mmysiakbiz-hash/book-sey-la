import { redirect } from "next/navigation";

// The old /business route rendered a static demo panel (hardcoded studio,
// non-functional Save/publish). The real owner tools live at /panel and the
// business marketing page is /for-studios — send visitors there.
export default function Page() {
  redirect("/for-studios");
}
