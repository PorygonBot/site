import { GetServerSideProps } from "next";
import Link from "next/link"
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild } from "../utils/types";
import { getUser } from "../utils/getUser";

interface Props {
    user: DiscordUser;
}

//TODO function over form. make the dashboard work before you make it look good.

export default function Index(props: Props) {
    const router = useRouter();

    return (
        <div>
            <h1>Porygon</h1>
            <Link href="/"><a>Home</a></Link>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
    ctx
) {
    let user = await getUser(ctx);

    if (!user) {
        return {
            redirect: {
                destination: "/api/oauth",
                permanent: false,
            },
        };
    }

    return { props: { user } };
};
