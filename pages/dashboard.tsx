import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild, League, Rules } from "../utils/types";
import { getUser } from "../utils/getUser";
import Prisma from "../utils/prisma";

interface Props {
    user: DiscordUser;
}
interface State {
    guild?: PartialGuild;
    league?: League;
    currentRules: Rules;
    saved: boolean;
}

export default function Index(props: Props) {
    const router = useRouter();
    const [state, setState] = useState({
        guild: props.user.guilds[0],
        league: props.user.guilds[0].leagues[0],
        currentRules: props.user.guilds[0].leagues[0].rules,
        saved: false,
    } as State);

    const onGuildSelect = (e) => {
        e.preventDefault();
        console.log(props.user.guilds);
        console.log(e.target.value);
        console.log(props.user.guilds.filter(
            (guild: PartialGuild) => guild.id === e.target.value
        ));
        setState({
            guild: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0],
            league: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0].leagues[0],
            currentRules: props.user.guilds.filter(
                (guild: PartialGuild) => guild.id === e.target.value
            )[0].leagues[0].rules,
            saved: false,
        });

        console.log(state.guild.name);
        console.log(state.guild.leagues.map((league) => league.name));
    };

    const onLeagueSelect = (e) => {
        e.preventDefault();
        setState({
            ...state,
            league: state.guild.leagues.filter(
                (league: League) => league.name === e.target.value
            )[0],
            currentRules: state.guild.leagues.filter(
                (league: League) => league.name === e.target.value
            )[0].rules,
            saved: false,
        });
    };

    const onRulesChange = (e) => {
        let newCurrentRules = state.currentRules;
        let value;
        if (e.target.value === "on") {
            value = true;
        }
        else if (e.target.value === "off") {
            value = false;
        }
        else {
            value = e.target.value;
        }
        newCurrentRules[e.target.name] = value;

        setState({
            ...state,
            currentRules: newCurrentRules,
            saved: false,
        });
    };

    const saveOptions = (e) => {
        const body = {
            channelId: state.league.channelId,
            leagueName: state.league.name,
            rules: JSON.stringify(state.currentRules),
        };
        console.dir(body);
        const result = fetch("/api/rules", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
            .then((result) => {
                return result;
            })
            .catch((e) => console.error(e));

        setState({ ...state, saved: true });
    };

    let savedText;
    if (state.saved) {
        savedText = <p>Saved!</p>;
    }

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
                        <div>
                            Recoil:
                            <input
                                type="radio"
                                id="D"
                                name="recoil"
                                value="D"
                                checked={state.currentRules.recoil === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="recoil"
                                value="P"
                                checked={state.currentRules.recoil === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="recoil"
                                value="N"
                                checked={state.currentRules.recoil === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                        <div onChange={onRulesChange}>
                            Suicide:
                            <input
                                type="radio"
                                id="D"
                                name="suicide"
                                value="D"
                                checked={state.currentRules.suicide === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="suicide"
                                value="P"
                                checked={state.currentRules.suicide === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="suicide"
                                value="N"
                                checked={state.currentRules.suicide === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                        <div onChange={onRulesChange}>
                            Ability/Item:
                            <input
                                type="radio"
                                id="D"
                                name="abilityitem"
                                value="D"
                                checked={state.currentRules.abilityitem === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="abilityitem"
                                value="P"
                                checked={state.currentRules.abilityitem === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="abilityitem"
                                value="N"
                                checked={state.currentRules.abilityitem === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                        <div onChange={onRulesChange}>
                            Self/Team:
                            <input
                                type="radio"
                                id="D"
                                name="selfteam"
                                value="D"
                                checked={state.currentRules.selfteam === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="selfteam"
                                value="P"
                                checked={state.currentRules.selfteam === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="selfteam"
                                value="N"
                                checked={state.currentRules.selfteam === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                        <div onChange={onRulesChange}>
                            Destiny Bond:
                            <input
                                type="radio"
                                id="D"
                                name="db"
                                value="D"
                                checked={state.currentRules.db === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="db"
                                value="P"
                                checked={state.currentRules.db === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="db"
                                value="N"
                                checked={state.currentRules.db === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                        <div onChange={onRulesChange}>
                            Forfeit
                            <input
                                type="radio"
                                id="D"
                                name="forfeit"
                                value="D"
                                checked={state.currentRules.forfeit === "D"}
                                onChange={onRulesChange}
                            />
                            <label>Direct</label>
                            <input
                                type="radio"
                                id="P"
                                name="forfeit"
                                value="P"
                                checked={state.currentRules.forfeit === "P"}
                                onChange={onRulesChange}
                            />
                            <label>Passive</label>
                            <input
                                type="radio"
                                id="N"
                                name="forfeit"
                                value="N"
                                checked={state.currentRules.forfeit === "N"}
                                onChange={onRulesChange}
                            />
                            <label>None</label>
                        </div>
                    </div>
                    <div id="statsOptions">
                        <p>
                            Spoiler:
                            <input
                                type="checkbox"
                                name="spoiler"
                                checked={state.currentRules.spoiler}
                                onChange={onRulesChange}
                            />
                        </p>
                        <p>
                            Tidbits:
                            <input
                                type="checkbox"
                                name="tidbits"
                                checked={state.currentRules.tb}
                                onChange={onRulesChange}
                            />
                        </p>
                        <p>
                            Combine Direct/Passive:
                            <input
                                type="checkbox"
                                name="combine"
                                checked={state.currentRules.combine}
                                onChange={onRulesChange}
                            />
                        </p>
                    </div>
                    <div id="otherOptions">
                        <p>
                            Quirks:
                            <input
                                type="checkbox"
                                name="quirks"
                                checked={state.currentRules.quirks}
                                onChange={onRulesChange}
                            />
                        </p>
                        <p>
                            Don't Talk in Discord:
                            <input
                                type="checkbox"
                                name="notalk"
                                checked={state.currentRules.notalk}
                                onChange={onRulesChange}
                            />
                        </p>
                        <p>
                            Ping:
                            <input
                                type="textbox"
                                name="ping"
                                value={state.currentRules.ping}
                                onChange={onRulesChange}
                            />
                            <Link href="https://media.discordapp.net/attachments/705546616383471656/909550970030133308/unknown.png">
                                <a target="_blank">?</a>
                            </Link>
                        </p>
                        <p>
                            Redirect Channel:
                            <input
                                type="textbox"
                                name="redirect"
                                value={state.currentRules.redirect}
                                onChange={onRulesChange}
                            />
                            <Link href="https://media.discordapp.net/attachments/692097604108156928/909550311767695400/unknown.png">
                                <a target="_blank">?</a>
                            </Link>
                        </p>
                    </div>
                    <button onClick={saveOptions}>Save</button>
                    {savedText}
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
                {props.user.guilds.filter((guild) => (guild.permissions as bigint & 1) << 28 != 0).map((guild: PartialGuild) => (
                    <option value={guild.id} key={guild.id}>{guild.name}</option>
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
            leagues.length != 0 && (guild.permissions as bigint & 1) << 28 != 0
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
