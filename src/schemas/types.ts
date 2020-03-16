import * as graphql from 'graphql';

export interface SchemeFields {
    fields: {
        [fieldName: string]: {
            type: graphql.GraphQLType,
            args: {
                [argName: string]: { type: graphql.GraphQLType },
            },
            resolve: (source, args, context, info: graphql.GraphQLResolveInfo) => any;
        }
    };
}
