import * as graphql from 'graphql';
import { WordCountScheme } from './word-count.scheme';
import { AllMessagesScheme } from './all-messages.scheme';

const wordCountScheme = new WordCountScheme();
const allMessagesScheme = new AllMessagesScheme();

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        ...allMessagesScheme.fields,
        ...wordCountScheme.fields,
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
 