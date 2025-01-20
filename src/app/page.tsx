import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import HomePage from "./_components/homePage";


export default async function Home() {
  const session = await auth();
  return (
    <HydrateClient>
      <HomePage userData={session?.user}/>
    </HydrateClient>
  );
}
