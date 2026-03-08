import EmbedClient from "@/components/EmbedClient"
import { getSession } from "@/lib/getSession"

export default async function Embed() {

    const session = await getSession()

    return (
        <>
            <EmbedClient ownerId={session?.user?.id!} />
        </>
    )
}

