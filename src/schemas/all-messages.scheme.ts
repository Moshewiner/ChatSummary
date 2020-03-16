import * as graphql from "graphql";
import { SchemeFields } from "./types";
import { Message } from "../parsers/types";

export class AllMessagesScheme implements SchemeFields {
    public get type() {
        return new graphql.GraphQLObjectType({
            name: 'MessageType',
            fields: {
                date: { type: graphql.GraphQLString },
                author: { type: graphql.GraphQLString },
                message: { type: graphql.GraphQLString },
            }
        });
    }

    public get resolver() {
        return (source, args, context, info: graphql.GraphQLResolveInfo) => {
            return context.conversation.filter((message: Message) => {
                return (args.author && message.author === args.author) ||
                    (args.message && message.message === args.message) ||
                    (args.date?.gt && message.date > args.date.gt) ||
                    (args.date?.lt && message.date < args.date.lt) 
            });
        }
    }

    public get fields() {
        return {
            allMessages: {
                type: graphql.GraphQLList(this.type),
                args: {
                    author: { type: graphql.GraphQLString },
                    message: { type: graphql.GraphQLString },
                    date: {type: this.dateOperators}
                },
                resolve: this.resolver
            }
        };
    }

    private get dateOperators() {
        return new graphql.GraphQLInputObjectType({
            name: 'DateOperators',
            fields: {
                gt: { type: graphql.GraphQLString },
                lt: { type: graphql.GraphQLString }
            }

        });
    }
}