import { Filter } from "./types";
import { Message } from "../parsers/types";

export class NonEmojiMessageFilter implements Filter {
    private emojiRegex = "([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2694-\u2697]|\uD83E[\uDD10-\uDD5D])";

    filter(messages: Message[]): Message[] {
        return messages
            .reduce((allmessages: Message[], message: Message) => {
                let emoji: string[] = Array.from((message.message as any).matchAll(this.emojiRegex));

                return [
                    ...allmessages,
                    ...emoji.map(e => ({
                        ...message,
                        message: e
                    }))
                ];
            }, []);
    }
}
