import * as graphql from 'graphql';
import { messageSchemeType } from './message.scheme';
import { WordCountAggregator } from '../data-aggregators/word-count';
import { MediaMessageFilter } from '../messages-filters/media.filter';
import { SystemAuthorMessageFilter } from '../messages-filters/system-author.filter';
import { wordCountfields } from './word-count.scheme';

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        ...wordCountfields
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
