import * as graphql from "graphql";
import { WordCountAggregator } from "../data-aggregators/word-count";
import { MediaMessageFilter } from "../messages-filters/media.filter";
import { SystemAuthorMessageFilter } from "../messages-filters/system-author.filter";

const parser = new WordCountAggregator([
    new MediaMessageFilter(),
    new SystemAuthorMessageFilter()
]);

const WordCountType = new graphql.GraphQLObjectType({
    name: 'WordCountType',
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

const resolver = (source, args, context, info: graphql.GraphQLResolveInfo, ) => {
    const aggregationResults = parser.aggregate(context.conversation);

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


export const wordCountfields = {
    wordCount: {
        type: graphql.GraphQLList(WordCountType),
        args: {
            author: { type: graphql.GraphQLString },
        },
        resolve: resolver
    }
};