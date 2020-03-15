import * as whatsapp from 'whatsapp-chat-parser';
import * as fs from 'fs';
import { Reader, Message } from '../types';

export class WhatsappReader implements Reader {
    async read(path: string): Promise<Message[]> {
        const fileContents = fs.readFileSync(path, { encoding: 'utf8' });
        return whatsapp.parseString(fileContents);
    }   
}