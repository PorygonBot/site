import { GetServerSidePropsContext } from "next";
import { DiscordUser, PartialGuild } from "./types";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import { config } from "./config";

export async function getUser(
    ctx: GetServerSidePropsContext
): Promise<DiscordUser> {
    if (!ctx.req.headers.cookie) {
        console.log("no cookie");
        return null;
    }

    const token = parse(ctx.req.headers.cookie)[config.cookieName];

    if (!token) {
        console.log("no user token");
        return null;
    }

    try {
        let { iat, exp, ...tokenObj } = verify(token, config.jwtSecret) as {
            accessToken: string;
        } & { iat: number; exp: number };

        const accessToken = tokenObj.accessToken;

        let me: DiscordUser = await fetch(
            "http://discord.com/api/users/@me",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        ).then((res) => res.json());

        const guilds: PartialGuild[] = await fetch(
            "http://discord.com/api/users/@me/guilds",
            {
                headers: { Authorization: `Bearer ${accessToken}` },
            }
        ).then((res) => res.json());

        me.guilds = guilds;

        return me;
    } catch (e) {
        console.error(e);
        return null;
    }
}
