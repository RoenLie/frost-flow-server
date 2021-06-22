import { Router } from 'express';
import mysql from 'mysql2';
import OlympicWinnersService from "../database/mysql/olympicWinnersService";

const mysqlRouter = Router();

mysqlRouter.get( '/', ( request: any, response: any ): void => {
   return response.json( "Welcome to mysql route" );
} );

mysqlRouter.get( "/read", async ( request: any, response: any ) => {
   const connection = mysql.createConnection( {
      host: "localhost",
      port: 3306,
      user: 'root',
      password: 'root'
   } );

   const SQLREAD = "SELECT * FROM sample_data.olympic_winners;";

   const result = await connection.promise().query( SQLREAD );

   connection.end();

   return response.json( result );
} );

mysqlRouter.post( '/olympicWinners', function ( req, res ) {

   OlympicWinnersService.getData( req.body, ( rows: any, lastRow: any ) => {
      res.json( { rows: rows, lastRow: lastRow } );
   } );
} );

mysqlRouter.get( "/countries", async ( request: any, response: any ) => {

   const countries = await OlympicWinnersService.getCountries( request, response );

   return response.json( countries );
} );

export default mysqlRouter;