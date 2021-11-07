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
        button = <h1>This is the dashboard!</h1>
        mainText = (
            <div>
                <p>
                    Hey, {props.user.username}#{props.user.discriminator}! Your
                    guilds are:
                    <ul>
                        {props.user.guilds.map((guild: PartialGuild) => (
                            <li>{guild.name}</li>
                        ))}
                    </ul>
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
    const user = await useUser(ctx);

    return { props: { user } };
};