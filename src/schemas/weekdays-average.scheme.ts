import * as graphql from "graphql";
import { MediaMessageFilter } from "../messages-filters/media.filter";
import { SystemAuthorMessageFilter } from "../messages-filters/system-author.filter";
import { SchemeFields } from "./types";
import { WeekdaysAverageAggregator, Weekdays } from "../data-aggregators/weekdays-average";
import { Aggregator } from "../data-aggregators/types";
import { Message } from "../parsers/types";
import * as _ from 'lodash';
import { EagerAnd } from 'eager-boolean-conditions';


export class WeekdaysAverageScheme implements SchemeFields {
    private parser: Aggregator;
    constructor() {
        this.parser = new WeekdaysAverageAggregator([
            new MediaMessageFilter(),
            new SystemAuthorMessageFilter()
        ]);
    }

    public get type() {
        return new graphql.GraphQLObjectType({
            name: 'WeekdaysAverageType',
            fields: {
                day: { type: graphql.GraphQLString },
                average: { type: graphql.GraphQLFloat },
            }
        });
    }

    public get resolver() {
        return (source, args, context, info: graphql.GraphQLResolveInfo) => {
            const conversation = context.conversation.filter((message: Message) => {
                if (_.isEmpty(args)) {
                    return true;
                }
                if (args.day && args.author) {
                    return Weekdays[message.date.getDay()] === args.day && message.author === args.author;
                }

                return Weekdays[message.date.getDay()] === args.day || message.author === args.author;
            });

            const aggregationResults = this.parser.aggregate(conversation);

            return Object.keys(aggregationResults).reduce((results, day) => {
                results.push({
                    day,
                    average: aggregationResults[day]
                });
                return results;
            }, []);
        };
    }


    public get fields() {
        return {
            WeekdaysAverage: {
                type: graphql.GraphQLList(this.type),
                args: {
                    author: { type: graphql.GraphQLString },
                    day: { type: graphql.GraphQLString }
                },
                resolve: this.resolver
            }
        };
    }
}