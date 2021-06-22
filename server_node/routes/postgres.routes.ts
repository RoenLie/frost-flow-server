import { Router } from 'express';
import mysql from 'mysql2';
import { AgGridPostGressQueryService } from "../database/postgres/agGridPostGresQueryService";
import { getDatabaseTypes, getRecordByTableAndId } from "../database/postgres/recordDataService";
import { connect } from "../database/postgres/connect";
import { getView, getView_es5, getView_es6, upsertSection } from "../database/postgres/view.dataservice";


const router = Router();

router.get( '/init', async ( request: any, response: any ) => {
   const connection = mysql.createConnection( {
      host: "localhost",
      port: 3306,
      user: 'root',
      password: 'root'
   } );

   const SQLREAD = "SELECT * FROM sample_data.olympic_winners;";

   const mariadbData = await connection.promise().query( SQLREAD );

   const olympic = mariadbData[ 0 ] as Array<any>;

   connection.end();
   // -------------------------------------------------------------
   const sql = connect();

   await sql`truncate olympic_winners`;

   const inserts = await Promise.all( olympic.map( async ( entry ) => {
      entry.date = entry.date.split( "/" ).reverse().join( "-" );

      return await sql`insert into olympic_winners ${ sql( entry ) }`;
   } ) );

   const data = await sql`
      select * from olympic_winners
      order by sys_id;
   `;

   sql.end();
   return response.json( data );
} );

router.post( '/olympic_winners', async ( request, response ) => {
   const queryService = new AgGridPostGressQueryService( connect, "olympic_winners" );
   const results = await queryService.getData( request.body );
   response.json( results );
} );

router.get( "/get/:table/:sysId", async ( request, response ) => {
   const { table, sysId } = request.params;

   const results = await getRecordByTableAndId( table, sysId );
   response.json( results );
} );

router.get( "/view/get/:table/:name", async ( request, response ) => {
   // const view = await getView( connect, { table: "olympic_winners" } );
   // return response.json( view );

   // const view = await getView_es6( connect, { table: "olympic_winners" } );
   // return response.json( view );

   getView_es5( connect, { table: "olympic_winners" } )
      .then( function ( viewRes ) {
         response.json( viewRes );
      } )
      .catch( function ( err ) {
         console.error( err );
         response.json( "" );
      } );
} );

router.get( "/view/section/upsert", async ( request, response ) => {
   const section = await upsertSection( connect, {
      name: "test",
      section_order: 10
   } );

   response.json( section );
} );

router.get( "/types", async ( request, response ) => {
   const results = await getDatabaseTypes();

   response.json( results );
} );

router.post( "/getsetfilter", async ( request: any, response: any ) => {
   const queryService = new AgGridPostGressQueryService( connect, "olympic_winners" );
   const results = await queryService.getSetFilter( request.body );
   response.json( results );
} );


export default router;