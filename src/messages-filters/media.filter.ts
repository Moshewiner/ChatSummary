import { Message } from 'whatsapp-chat-parser';
import { Filter } from './types';

export class MediaMessageFilter implements Filter {
    filter(messages: Message[]): Message[] {
        return messages.filter(message => message.message !== '<Media omitted>');
    }
}