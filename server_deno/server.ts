import { Application } from 'https://deno.land/x/oak/mod.ts';

import router from './routes.ts';
const HOST = 'localhost';
const PORT = 7700;

const app = new Application();

app.use( router.routes() );
app.use( router.allowedMethods() );

console.log( `Listening on http://${ HOST }:${ PORT }/ ...` );
await app.listen( `${ HOST }:${ PORT }` );