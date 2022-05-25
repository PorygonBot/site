import { useState } from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild, League, Rules } from "../utils/types";
import { Radio, Checkbox } from "../utils/dashInput";
import { Header } from "../utils/header"
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
        newCurrentRules[e.target.name] = e.target.value;

        setState({
            ...state,
            currentRules: newCurrentRules,
            saved: false,
        });
    };

    const onRulesCheckboxChange = (e) => {
        let newCurrentRules = state.currentRules;
        newCurrentRules[e.target.name] = e.target.checked;

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

    const deleteLeague = (e) => {
        if (
            window.confirm(
                `Are you sure you want to delete league "${state.league.name}" in "${state.guild.name}"?`
            )
        ) {
            const result = fetch("/api/rules", {
                method: "DELETE",
                body: JSON.stringify({
                    channelId: state.league.channelId,
                }),
            })
                .then((result) => result)
                .catch((e) => console.error(e));

            router.replace(router.asPath);
            router.reload();
        }
    };

    let savedText;
    if (state.saved) {
        savedText = "  Saved!";
    }

    let leagueDropdown;
    let leagueInfo;
    if (state.guild) {
        leagueDropdown = (
            <div>
                <label>League: </label>
                <select name="leagues" id="leagues" onChange={onLeagueSelect}>
                    {state.guild.leagues.map((league: League) => (
                        <option value={league.name} key={league.channelId}>
                            {league.name}
                        </option>
                    ))}
                </select>
            </div>
        );

        if (state.league) {
            leagueInfo = (
                <div id="options">
                    <div id="battleOptions">
                        <div onChange={onRulesChange}>
                            Recoil:
                            <Radio
                                rule="recoil"
                                currentRule={state.currentRules.recoil}
                                onChange={onRulesChange}
                            />
                        </div>
                        <div onChange={onRulesChange}>
                            Suicide:
                            <Radio
                                rule="suicide"
                                currentRule={state.currentRules.suicide}
                                onChange={onRulesChange}
                            />
                        </div>
                        <div onChange={onRulesChange}>
                            Ability/Item:
                            <Radio
                                rule="abilityitem"
                                currentRule={state.currentRules.abilityitem}
                                onChange={onRulesChange}
                            />
                        </div>
                        <div onChange={onRulesChange}>
                            Self/Team:
                            <Radio
                                rule="selfteam"
                                currentRule={state.currentRules.selfteam}
                                onChange={onRulesChange}
                            />
                        </div>
                        <div onChange={onRulesChange}>
                            Destiny Bond:
                            <Radio
                                rule="db"
                                currentRule={state.currentRules.db}
                                onChange={onRulesChange}
                            />
                        </div>
                        <div onChange={onRulesChange}>
                            Forfeit
                            <Radio
                                rule="forfeit"
                                currentRule={state.currentRules.forfeit}
                                onChange={onRulesChange}
                            />
                        </div>
                    </div>
                    <div id="statsOptions">
                        <p>
                            Spoiler:
                            <Checkbox
                                rule="spoiler"
                                currentRule={state.currentRules.spoiler}
                                onChange={onRulesCheckboxChange}
                            />
                        </p>
                        <p>
                            Tidbits:
                            <Checkbox
                                rule="tb"
                                currentRule={state.currentRules.tb}
                                onChange={onRulesCheckboxChange}
                            />
                        </p>
                        <p>
                            Combine Direct/Passive:
                            <Checkbox
                                rule="combine"
                                currentRule={state.currentRules.combine}
                                onChange={onRulesCheckboxChange}
                            />
                        </p>
                    </div>
                    <div id="otherOptions">
                        <p>
                            Quirks:
                            <Checkbox
                                rule="quirks"
                                currentRule={state.currentRules.quirks}
                                onChange={onRulesCheckboxChange}
                            />
                        </p>
                        <p>
                            Don't Talk in Discord:
                            <Checkbox
                                rule="notalk"
                                currentRule={state.currentRules.notalk}
                                onChange={onRulesCheckboxChange}
                            />
                        </p>
                        <p>
                            Ping:⠀
                            <input
                                type="textbox"
                                name="ping"
                                value={state.currentRules.ping}
                                onChange={onRulesChange}
                            />
                            ⠀⠀
                            <Link href="https://media.discordapp.net/attachments/705546616383471656/909550970030133308/unknown.png">
                                <a target="_blank">?</a>
                            </Link>
                        </p>
                        <p>
                            Redirect Channel:⠀
                            <input
                                type="textbox"
                                name="redirect"
                                value={state.currentRules.redirect}
                                onChange={onRulesChange}
                            />
                            ⠀⠀
                            <Link href="https://media.discordapp.net/attachments/692097604108156928/909550311767695400/unknown.png">
                                <a target="_blank">?</a>
                            </Link>
                        </p>
                    </div>
                    <button onClick={saveOptions}>Save</button> {savedText}
                    <button onClick={deleteLeague}>Delete</button>
                </div>
            );
        }
    }

    return (
        <div>
            <Header />
            <p>This is your dashboard</p>
            <br />
            <label>Server: </label>
            <select name="guilds" id="guilds" onChange={onGuildSelect}>
                {props.user.guilds.map((guild: PartialGuild) => (
                    <option value={guild.id} key={guild.id}>
                        {guild.name}
                    </option>
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

    if (!(user && user.guilds)) {
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
            (BigInt(guild.permissions) & (1n << 28n)) != 0n
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
