import express from 'express';
import cors from "cors";
import routes from "./routes";


const PORT = 8025;
const app = express();

app.set( "json spaces", 4 );
app.use( express.json() );
app.use( cors() );
app.use( routes );


app.get( '/', ( req, res ) => res.send( 'Express +++++ TypeScript Server' ) );
app.listen( PORT, () => {
   console.log( `⚡️[server]: Server is running at http://localhost:${ PORT }` );
} );