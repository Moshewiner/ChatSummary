import { Message } from "../parsers/types";

export interface Aggregator{
    aggregate(messages: Message[]): any;
}