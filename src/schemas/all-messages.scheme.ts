import * as graphql from "graphql";
import { SchemeFields } from "./types";
import { Message } from "../parsers/types";
import * as _ from 'lodash';

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

    private recursiveAnd() {

    }

    public get resolver() {
        return (source, args, context, info: graphql.GraphQLResolveInfo) => {
            return context.conversation.filter((message: Message) => {
                if (_.isEmpty(args)) {
                    return true;
                }

                return Object.keys(args)
                    .reduce((result, arg) => {
                        if (arg === 'date') {
                            result = result && 
                            (args.date?.eq && Number(message.date) === +args.date.eq) ||
                            (args.date?.gt && Number(message.date) > +args.date.gt) ||
                            (args.date?.lt && Number(message.date) < +args.date.lt);
                        }
                        else {
                            result = result && message[arg] === args[arg];
                        }
                        return result;
                    }, true);
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
                    date: { type: this.dateOperators }
                },
                resolve: this.resolver
            }
        };
    }

    private get dateOperators() {
        return new graphql.GraphQLInputObjectType({
            name: 'DateOperators',
            fields: {
                eq: { type: graphql.GraphQLString },
                gt: { type: graphql.GraphQLString },
                lt: { type: graphql.GraphQLString }
            }

        });
    }
}