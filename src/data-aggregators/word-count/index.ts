import { Filter } from './../../messages-filters/types';
import { Message } from "../../parsers/types";
import * as sw from 'stopword';

type WordsPerAuthor = {
    [author: string]: Histogram
};

type Histogram = {
    [keyword: string]: number
};

export class WordCountAggregator {
    constructor(private filters: Filter[]) { }

    runFilters(filters: Filter[], messages: Message[]): Message[] {
        return filters.reduce((allMessages: Message[], filter: Filter) => {
            return filter.filter(allMessages);
        }, messages);
    }

    aggregate(messages: Message[]): WordsPerAuthor {
        const relevantMessages: Message[] = this.runFilters(this.filters, messages);
        const wordsPerAuthor = relevantMessages.reduce((wordsPerAuthor, message) => {
            const keywords: string[] = message.message.split(' ');
            wordsPerAuthor[message.author] = this.calcHistogram(keywords, wordsPerAuthor[message.author] || {});
            return wordsPerAuthor;
        }, {});

        return Object.keys(wordsPerAuthor).reduce((all, author) => {
            return {
                ...all,
                [author]: this.getMostCommon(wordsPerAuthor[author], 10)
            };
        }, {});
    }

    private getMostCommon(historgam: Histogram, count: number = 10): Histogram {

        return Object.entries(historgam)
            .sort((entryA: [string, number], entryB: [string, number]) => entryA[1] > entryB[1] ? -1 : 1)
            .slice(0, count)
            .reduce((histogram, entry) => {
                histogram[entry[0]] = entry[1];
                return histogram;
            }, {});
    }

    private calcHistogram(keywords: string[], initalHistogram) {
        return keywords.reduce((histogram, keyword) => {
            histogram[keyword] = (histogram[keyword] || 0) + 1;

            return histogram;
        }, initalHistogram);
    }
}
