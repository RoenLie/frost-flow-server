import express from 'express';
import cors from "cors";
import http from "http";
import routes from "./routes";
import path from "path";
import { createDynStatic } from "./utilities/createDynStatic";


/**
 * Create instance of express
 */
const app = express();


/**
 * Enable response body decoder
 */
app.use( express.json() );
app.use( express.urlencoded( { extended: true } ) );


/**
 * Allowed cors origins
 */
var allowedOrigins = [
   "http://localhost:8025",
   "http://roenlie.com",
   "http://81.166.139.5"
];


/**
 * setup of cors policy.
 */
app.use(
   cors( {
      origin: function ( origin: any, callback: any ) {
         // allow requests with no origin
         // (like mobile apps or curl requests)
         if ( !origin ) return callback( null, true );
         if ( allowedOrigins.indexOf( origin ) === -1 ) {
            var msg =
               "The CORS policy for this site does not " +
               "allow access from the specified Origin.";
            return callback( new Error( msg ), false );
         }
         return callback( null, true );
      }
   } )
);


/**
 * Inject routes
 */
app.use( routes );


/**
 * Create static path.
 */
const clientPath = path.join( __dirname, "../../frost-flow-client/client/dist/frost-flow-client" );
let dyn = createDynStatic( express, clientPath );
app.use( dyn );


/**
 * Set server port
 */
const port = process.env.FrostflowPort || 8025;


/**
 * Create and start server
 */
const server = http.createServer( app );
server.listen( port );
console.log( `⚡️[server]: Server is running at http://localhost:${ port }` );