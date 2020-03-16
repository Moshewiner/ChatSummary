import { WhatsappReader } from "./parsers/whatsapp/whatsapp.reader";
import { Reader, Message } from "./parsers/types";
import { schema } from './schemas';
import * as express from 'express';
import * as graphqlHTTP from 'express-graphql';

export const app = async () => {
    const reader: Reader = new WhatsappReader();
    const conversation: Message[] = await reader.read('.\\assets\\moshe-shaked.txt');



    const app = express();

    app.use(
        '/graphql',
        graphqlHTTP({
            schema,
            graphiql: true,
            context: {
                conversation
            }
        }),
    );

    app.listen(4000);

};
