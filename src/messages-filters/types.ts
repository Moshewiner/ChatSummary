import { Message } from 'whatsapp-chat-parser';

export interface Filter {
    filter(messages: Message[]): Message[];
}