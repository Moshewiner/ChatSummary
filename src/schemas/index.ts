import * as graphql from 'graphql';
import { WordCountScheme } from './word-count.scheme';
import { AllMessagesScheme } from './all-messages.scheme';
import { WeekdaysAverageScheme } from './weekdays-average.scheme';
import { WeekdaysEmojiAverageScheme } from './weekdays-average-emoji.scheme';

const wordCountScheme = new WordCountScheme();
const allMessagesScheme = new AllMessagesScheme();
const weekdaysAverageScheme = new WeekdaysAverageScheme();
const weekdaysEmojiAverageScheme = new WeekdaysEmojiAverageScheme();

const queryType = new graphql.GraphQLObjectType({
    name: 'AggregationsQuery',
    fields: {
        allMessages: allMessagesScheme.fields,
        wordCount: wordCountScheme.fields,
        weekdaysAverage: weekdaysAverageScheme.fields,
        weekdaysAverageEmoji: weekdaysEmojiAverageScheme.fields
    }
});

export const schema = new graphql.GraphQLSchema({ query: queryType });
 