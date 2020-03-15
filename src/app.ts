import { MediaMessageFilter } from './messages-filters/media.filter';
import { SystemAuthorMessageFilter } from './messages-filters/system-author.filter';
import { WhatsappReader } from "./parsers/whatsapp/whatsapp.reader";
import { Reader, Message } from "./parsers/types";
import { WordCountAggregator } from "./data-aggregators/word-count/index";

export const app = async () => {
    const reader: Reader = new WhatsappReader();
    const conversation: Message[] = await reader.read('.\\assets\\moshe-shaked.txt');
    const parser = new WordCountAggregator([
        new MediaMessageFilter(),
        new SystemAuthorMessageFilter()
    ]);
    const res = parser.aggregate(conversation);
    console.log(res);
};
