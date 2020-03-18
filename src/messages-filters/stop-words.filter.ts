import { Filter } from "./types";
import { Message } from "../parsers/types";
import * as sw from 'stopword';

export class StopWordsMessageFilter implements Filter {

    filter(messages: Message[]): Message[] {
        const r = messages
            .map((message: Message) => {
                return {
                    ...message,
                    message: this.filterStopWords(message.message.split(' ')).join(' ')
                };
            })
            .filter((message: Message) => !!message.message);
        console.log({ r });
        return r;
    }

    private filterStopWords(keywords: string[]): string[] {
        return sw.removeStopwords(keywords, sw.he).filter(keyword => keyword !== '-' && keyword.split('').some(letter => letter !== 'ח'));
    }
}

