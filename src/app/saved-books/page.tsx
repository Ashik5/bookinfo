import SavedBook from "../_components/savedBook"
import { auth } from "~/server/auth"
import { HydrateClient } from "~/trpc/server";

export default async function SavedBookPage() {
    const session = await auth();
    return(
        <HydrateClient>
            <SavedBook userData={session?.user}/>
        </HydrateClient>
    )
}