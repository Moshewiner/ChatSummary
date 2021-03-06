import * as graphql from "graphql";
import { WordCountAggregator } from "../data-aggregators/word-count";
import { MediaMessageFilter } from "../messages-filters/media.filter";
import { SystemAuthorMessageFilter } from "../messages-filters/system-author.filter";
import { SchemeFields } from "./types";
import { StopWordsMessageFilter } from "../messages-filters/stop-words.filter";

export class WordCountScheme implements SchemeFields {
    private parser: WordCountAggregator;
    constructor() {
        this.parser = new WordCountAggregator([
            new StopWordsMessageFilter(),
            new MediaMessageFilter(),
            new SystemAuthorMessageFilter()
        ]);
    }

    public get type() {
        return new graphql.GraphQLObjectType({
            name: this.constructor.name,
            fields: {
                author: { type: graphql.GraphQLString },
                keywords: {
                    type: graphql.GraphQLList(new graphql.GraphQLObjectType({
                        name: 'authorWordCount',
                        fields: {
                            keyword: { type: graphql.GraphQLString },
                            count: { type: graphql.GraphQLInt }
                        }
                    }))
                }
            }
        });
    }

    public get resolver() {
        return (source, args, context, info: graphql.GraphQLResolveInfo) => {
            const aggregationResults = this.parser.aggregate(context.conversation);

            return Object.keys(aggregationResults).reduce((results, author) => {
                results.push({
                    author,
                    keywords: Object.keys(aggregationResults[author])
                        .reduce((keywords, keyword) => {
                            keywords.push({
                                keyword,
                                count: aggregationResults[author][keyword]
                            });
                            return keywords;
                        }, [])
                });
                return results;
            }, []);
        };
    }


    public get fields() {
        return {
            type: graphql.GraphQLList(this.type),
            args: {
                author: { type: graphql.GraphQLString },
            },
            resolve: this.resolver

        };
    }
}