import { Aggregator } from "../types";
import { Filter } from "../../messages-filters/types";
import { Message } from "../../parsers/types";
import { last, sum } from 'lodash';

type MessagesBucketsPerWeekday = {
    [day: string]: number[]
}

type AverageMessagesPerWeekday = {
    [day: string]: number
}

export enum Weekdays {
    Sunday,
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday
}

const isEnumValue = (value) => {
    return typeof value !== 'number';
}

export class WeekdaysAverageAggregator implements Aggregator {
    constructor(private filters: Filter[]) { }

    runFilters(filters: Filter[], messages: Message[]): Message[] {
        return filters.reduce((allMessages: Message[], filter: Filter) => {
            return filter.filter(allMessages);
        }, messages);
    }

    aggregate(messages: Message[]): AverageMessagesPerWeekday {
        const relevantMessages: Message[] = this.runFilters(this.filters, messages);
        const daysOfMessages: string[] = this.extractDaysOfMessages(relevantMessages);
        const messagesBucketsPerDay = this.getMessagesBucketsPerDay(daysOfMessages);

        return this.calcAverage(messagesBucketsPerDay);
    }

    extractDaysOfMessages(messages: Message[]): string[] {
        const messagesDays: string[] = messages.map(message => Weekdays[message.date.getDay()]);
        messagesDays.push(last(messagesDays));

        return messagesDays;
    }

    getMessagesBucketsPerDay(daysOfMessages: string[]): MessagesBucketsPerWeekday {
        const messagesPerDay: MessagesBucketsPerWeekday = this.initializeBuckets();
        let count = 1;

        return daysOfMessages.reduce((bucketsPerDay, day, i) => {
            if (i < daysOfMessages.length) {
                if (daysOfMessages[i] === daysOfMessages[i + 1]) {
                    count++;
                } else {
                    bucketsPerDay[day].push(count);
                    count = 1;
                }
            }

            return bucketsPerDay;
        }, messagesPerDay);
    }

    initializeBuckets(): MessagesBucketsPerWeekday {
        return Object.keys(Weekdays)
            .filter(day => isEnumValue(Weekdays[day]))
            .reduce((messagesPerDay, day) => {
                messagesPerDay[Weekdays[day]] = [];

                return messagesPerDay;
            }, {})
    }

    calcAverage(messagesPerDay: MessagesBucketsPerWeekday): AverageMessagesPerWeekday {
        return Object.keys(messagesPerDay).reduce((averagePerDay, day) => {
            if (messagesPerDay[day].length) {
                averagePerDay[day] = sum(messagesPerDay[day]) / messagesPerDay[day].length;
            }
            
            return averagePerDay;
        }, {});
    }
}