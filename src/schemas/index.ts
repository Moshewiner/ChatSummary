import * as graphql from 'graphql';
import { messageSchemeType } from './message.scheme';
import { WordCountAggregator } from '../data-aggregators/word-count';
import { MediaMessageFilter } from '../messages-filters/media.filter';
import { SystemAuthorMessageFilter } from '../messages-filters/system-author.filter';
import { WordCountType } from './word-count.scheme';

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        wordCount: {
            type: graphql.GraphQLList(WordCountType),
            args: {
                author: { type: graphql.GraphQLString },
            },
            resolve: (source, args, context, info: graphql.GraphQLResolveInfo, ) => {
                const parser = new WordCountAggregator([
                    new MediaMessageFilter(),
                    new SystemAuthorMessageFilter()
                ]);
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
            }
        }
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
