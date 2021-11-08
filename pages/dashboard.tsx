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
    const [state, setState] = useState({
        guild: props.user.guilds[0],
        league: props.user.guilds[0].leagues[0],
    } as State);

    const onGuildSelect = (e) => {
        e.preventDefault();
        setState({
            guild: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0],
            league: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0].leagues[0],
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
    let leagueInfo;
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

        if (state.league) {
            leagueInfo = (
                <div id="options">
                    <div id="battleOptions">
                        <p>
                            Recoil:
                            <input
                                type="radio"
                                id="direct"
                                name="recoil"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="recoil"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="recoil"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                        <p>
                            Suicide:
                            <input
                                type="radio"
                                id="direct"
                                name="suicide"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="suicide"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="suicide"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                        <p>
                            Ability/Item:
                            <input
                                type="radio"
                                id="direct"
                                name="abilityitem"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="abilityitem"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="abilityitem"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                        <p>
                            Self/Team:
                            <input
                                type="radio"
                                id="direct"
                                name="selfteam"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="selfteam"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="selfteam"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                        <p>
                            Destiny Bond:
                            <input
                                type="radio"
                                id="direct"
                                name="db"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="db"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="db"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                        <p>
                            Forfeit
                            <input
                                type="radio"
                                id="direct"
                                name="forfeit"
                                value="direct"
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="passive"
                                name="forfeit"
                                value="passive"
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="none"
                                name="forfeit"
                                value="none"
                            />
                            <label>None</label>
                        </p>
                    </div>
                    <div id="statsOptions">
                        <p>
                            Spoiler:
                            <input type="checkbox" name="spoiler" />
                        </p>
                        <p>
                            Tidbits:
                            <input type="checkbox" name="tidbits" />
                        </p>
                        <p>
                            Combine Direct/Passive:
                            <input type="checkbox" name="combine" />
                        </p>
                    </div>
                    <div id="otherOptions">
                        <p>
                            Quirks: 
                            <input type="checkbox" name="quirks" />
                        </p>
                        <p>
                            Don't Talk in Discord: 
                            <input type="checkbox" name="notalk" />
                        </p>
                        <p>
                            Ping: 
                            <input type="textbox" name="ping" />
                        </p>
                        <p>
                            Redirect Channel: 
                            <input type="textbox" name="redirect" />
                        </p>
                    </div>
                </div>
            );
        }
    }

    return (
        <div>
            <h1>Porygon</h1>
            <Link href="/">
                <a>Home</a>
            </Link>
            <p>This is your dashboard</p>
            <br />
            <label>Server: </label>
            <select name="guilds" id="guilds" onChange={onGuildSelect}>
                {props.user.guilds.map((guild: PartialGuild) => (
                    <option value={guild.id}>{guild.name}</option>
                ))}
            </select>
            <br />
            {leagueDropdown}
            {leagueInfo}
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

        if (
            leagues.length != 0 &&
            (guild.permissions as bigint & 1) << 28 != 0
        ) {
            for (let i = 0; i < newGuild.leagues.length; i++) {
                newGuild.leagues[i].rules = await Prisma.getRules(
                    newGuild.leagues[i].channelId
                );
            }
            finalGuilds.push(newGuild);
        }
    }

    user.guilds = finalGuilds;

    return { props: { user } };
};
