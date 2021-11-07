import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { DiscordUser, PartialGuild } from "../utils/types";
import { useUser } from "../utils/useUser";

interface Props {
    user: DiscordUser;
}

//TODO function over form. make the dashboard work before you make it look good.

export default function Index(props: Props) {
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

    return { props: { user } };
};
