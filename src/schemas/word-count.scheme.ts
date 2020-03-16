import * as graphql from "graphql";

export const WordCountType = new graphql.GraphQLObjectType({
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
