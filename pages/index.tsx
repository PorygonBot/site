import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild } from "../utils/types";
import { useUser } from "../utils/useUser";

interface Props {
    user: DiscordUser;
}

//TODO function over form. make the dashboard work before you make it look good.

export default function Index(props: Props) {
    // return (
    //     <h1>
    //         Hey, {props.user.username}#{props.user.discriminator}
    //     </h1>
    // );
    const router = useRouter();

    const onLoginClick = (e) => {
        e.preventDefault();
        router.push("/api/oauth");
    };

    let loginButton;
    let mainText;
    if (!props.user) {
        loginButton = <button onClick={onLoginClick}>Login</button>;
        mainText = <h2>Please login.</h2>;
    } else {
        // mainText = (
        //     <h1>
        //         Hey, {props.user.username}#{props.user.discriminator}! Your
        //         guilds are:{" "}
        //         {props.user.guilds.map((guild: PartialGuild) => guild.name)}
        //     </h1>
        // );

        mainText = (
            <div>
                <p>
                    Hey, {props.user.username}#{props.user.discriminator}!
                    Your guilds are:
                    <ul>
                        {props.user.guilds.map((guild: PartialGuild) => (
                            <li>{guild.name}</li>
                        ))}
                    </ul>
                </p>
            </div>
        );
    }

    if (!props.user) {
        return (
            <div>
                {loginButton}
                {mainText}
            </div>
        );
    }

    return (
        <div>
            {mainText}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async function (
    ctx
) {
    const user = await useUser(ctx);
    //const guilds = parseGuilds(ctx);
    // console.log(user.username);
    // console.log(user.guilds);

    // if (!user) {
    //     return {
    //         redirect: {
    //             destination: "/api/oauth",
    //             permanent: false,
    //         },
    //     };
    // }

    //return { props: { user, guilds } };
    return { props: { user } };
};
