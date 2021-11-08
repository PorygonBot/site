import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild, League } from "../utils/types";
import { getUser } from "../utils/getUser";
import Prisma from "../utils/prisma";

interface Props {
    user: DiscordUser;
}

interface State {
    guild?: PartialGuild;
    league?: League;
}

export default function Index(props: Props) {
    const router = useRouter();
    const [state, setState] = useState({} as State);

    const onGuildSelect = (e) => {
        e.preventDefault();
        setState({
            guild: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0],
        });
    };

    const onLeagueSelect = (e) => {
        e.preventDefault();
        setState({
            ...state,
            league: state.guild.leagues.filter(
                (league: League) => league.name === e.target.value
            )[0],
        });
    };

    let leagueDropdown;
    if (state.guild) {
        leagueDropdown = (
            <div>
                <label>League: </label>
                <select name="leagues" id="leagues" onChange={onLeagueSelect}>
                    {state.guild.leagues.map((league: League) => (
                        <option value={league.name}>{league.name}</option>
                    ))}
                </select>
            </div>
        );
    }

    return (
        <div>
            <h1>Porygon</h1>
            <Link href="/">
                <a>Home</a>
            </Link>
            <p>This is your dashboard</p>
            <br />
            <br />
            <label>Server: </label>
            <select name="guilds" id="guilds" onChange={onGuildSelect}>
                {props.user.guilds.map((guild: PartialGuild) => (
                    <option value={guild.id}>{guild.name}</option>
                ))}
            </select>
            <br />
            {leagueDropdown}
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

    let finalGuilds = [];
    for (let guild of user.guilds) {
        let newGuild: PartialGuild = guild;
        let leagues = await Prisma.leagueWhere("guildId", guild.id);
        newGuild.leagues = leagues;

        if (leagues.length != 0 && (guild.permissions as bigint & 1<<28) != 0) {
            finalGuilds.push(newGuild);
        }
    }

    user.guilds = finalGuilds;

    return { props: { user } };
};
