import { NextApiRequest, NextApiResponse } from "next";
import Prisma from "../../utils/prisma";

//PUT /api/rules
export default async (req: NextApiRequest, res: NextApiResponse) => {
    let result;

    console.log(req.method);

    if (req.method === "GET") {
        const channelId = req.body.channelId;
        result = await Prisma.getRules(channelId);
    } else if (req.method === "PUT") {
        let { channelId, leagueName, rules } = req.body;
        rules = JSON.parse(rules);

        result = await Prisma.upsertRules(
            channelId,
            leagueName,
            rules
        ).catch((e) => console.error(e));
    } else {
        res.status(400).send({ message: "Only PUT requests allowed" });
        return;
    }

    res.json(result);
};
