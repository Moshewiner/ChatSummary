import * as graphql from 'graphql';
import { wordCountfields } from './word-count.scheme';

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        ...wordCountfields
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
 