import * as whatsapp from "whatsapp-chat-parser";

export interface Message extends whatsapp.Message {}

export interface Reader {
    read(path: string): Promise<Message[]>;
}