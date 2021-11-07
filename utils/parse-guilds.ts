import { GetServerSidePropsContext } from "next";
import { PartialGuild } from "./types";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import { config } from "./config";

export function parseGuilds(ctx: GetServerSidePropsContext): PartialGuild[] | null {
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
        let { iat, exp, ...guilds } = verify(
            token,
            config.jwtSecret
        ) as { guilds: PartialGuild[] } & { iat: number; exp: number };
        return guilds.guilds;
    } catch (e) {
        console.error(e);
        return null;
    }
}
