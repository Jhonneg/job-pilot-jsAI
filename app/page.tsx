import { Homepage } from "@/components/homepage/Homepage";
import { createInsforgeServerClient } from "@/lib/insforge/server";

export default async function Home() {
  const insforge = await createInsforgeServerClient();
  const { data } = await insforge.auth.getCurrentUser();

  return <Homepage startHref={data.user ? "/dashboard" : "/login"} />;
}
