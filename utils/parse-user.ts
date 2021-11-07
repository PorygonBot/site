import { GetServerSidePropsContext } from "next";
import { DiscordUser } from "./types";
import { parse } from "cookie";
import { verify } from "jsonwebtoken";
import { config } from "./config";

export function parseUser(ctx: GetServerSidePropsContext): DiscordUser | null {
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
        let { iat, exp, ...user } = verify(
            token,
            config.jwtSecret
        ) as DiscordUser & { iat: number; exp: number };
        return user;
    } catch (e) {
        console.error(e);
        return null;
    }
}
