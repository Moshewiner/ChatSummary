import { WeekdaysAverageScheme } from "./weekdays-average.scheme";
import { WeekdaysAverageAggregator } from "../data-aggregators/weekdays-average";
import { MediaMessageFilter } from "../messages-filters/media.filter";
import { SystemAuthorMessageFilter } from "../messages-filters/system-author.filter";
import { NonEmojiMessageFilter } from "../messages-filters/non-emoji.filter";
import * as  graphql from "graphql";

export class WeekdaysEmojiAverageScheme extends WeekdaysAverageScheme {
    constructor() {
        super();
        this.parser = new WeekdaysAverageAggregator([
            new MediaMessageFilter(),
            new SystemAuthorMessageFilter(),
            new NonEmojiMessageFilter()
        ]);
    }

    public get fields() {
        return {
            type: graphql.GraphQLList(this.type),
            args: {
                author: { type: graphql.GraphQLString },
                day: { type: graphql.GraphQLString }
            },
            resolve: this.resolver

        };
    }
}
