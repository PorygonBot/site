export interface PartialGuild {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: string;
	features: string[];
	leagues?: League[];
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

export interface Rules {
    channelId: string,
	leagueName: string,
	recoil: string,
	suicide: string,
	abilityitem: string,
	selfteam: string,
	db: string,
	spoiler: boolean,
	ping: string,
	forfeit: string,
	format: string,
	quirks: boolean,
	notalk: boolean,
	tb: boolean,
	combine: boolean,
	redirect: string,
	isSlash?: boolean,
}

export interface League {
	name: string;
	guildId: string;
	channelId: string;
	resultsChannelId?: string;
	dlId?: string;
	sheetId?: string;
	system: string;
	rolesChannels?: { [key: string]: string };
	rules?: Rules;
}
