import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild } from "../utils/types";
import { getUser } from "../utils/getUser";
import Prisma from '../utils/prisma';

interface Props {
    user: DiscordUser;
}

export default function Index(props: Props) {
    const router = useRouter();

    const onLoginClick = (e) => {
        e.preventDefault();
        router.push("/api/oauth");
    };

    const onDashboardClick = (e) => {
        e.preventDefault();
        router.push("/dashboard");
    };

    let button;
    let mainText;
    if (!props.user) {
        button = <button onClick={onLoginClick}>Login</button>;
        mainText = <h2>Please login.</h2>;
    } else {
        //button = <button onClick={onDashboardClick}>Dashboard</button>;
        button = <Link href="/dashboard"><a>Dashboard</a></Link>;
        mainText = (
            <div>
                <p>
                    Hey, {props.user.username}#{props.user.discriminator}! Click on the dashbaord link above.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1>Porygon</h1>
            {button}
            {mainText}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
    ctx
) {
    let user = await getUser(ctx);

    // let finalGuilds = [];
    // for (let guild of user.guilds) {
    //     let leagues = await Prisma.leagueWhere("guildId", guild.id);
    //     if (leagues.length != 0) {
    //         finalGuilds.push(guild);
    //     }
    // }

    // user.guilds = finalGuilds;

    return { props: { user } };
};
