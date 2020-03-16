import * as graphql from "graphql";

export const messageSchemeType = new graphql.GraphQLObjectType({
  name: 'MessageType',
  fields: {
    date: { type: graphql.GraphQLString },
    author: { type: graphql.GraphQLString },
    message: { type: graphql.GraphQLString },
  }
});
