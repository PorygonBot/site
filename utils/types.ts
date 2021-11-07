export interface PartialGuild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
    features: string[];
}

export interface DiscordUser {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    flags: number;
    public_flags: number;
    premium_type: number;
    guilds?: PartialGuild[];
}
