import * as graphql from 'graphql';
import { WordCountScheme } from './word-count.scheme';
import { AllMessagesScheme } from './all-messages.scheme';
import { WeekdaysAverageScheme } from './weekdays-average.scheme';

const wordCountScheme = new WordCountScheme();
const allMessagesScheme = new AllMessagesScheme();
const weekdaysAverageScheme = new WeekdaysAverageScheme();

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        ...allMessagesScheme.fields,
        ...wordCountScheme.fields,
        ...weekdaysAverageScheme.fields
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
 