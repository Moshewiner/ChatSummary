import { Message } from 'whatsapp-chat-parser';
import { Filter } from './types';
export class SystemAuthorMessageFilter implements Filter {
    filter(messages: Message[]): Message[] {
        return messages.filter(message => message.author !== 'System');
    }
}