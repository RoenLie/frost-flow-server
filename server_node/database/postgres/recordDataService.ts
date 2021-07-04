import { connect, PostGresConnection } from "./connect";
import { formatResult } from "./formatResult";
import { asyncRes, asyncRes2 } from "../../utilities/asyncRes";


export const getDatabaseTypes = async () => {
   const sql = connect();
   const query = `SELECT oid, typname FROM pg_type`;

   const [ types, err ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   if ( err ) return null;

   const formattedTypes = types.reduce( ( prev: any, cur: any ) => {
      prev[ cur.oid ] = cur.typname; return prev;
   }, {} );

   return formattedTypes;
};


export const getRecordByTableAndId = async ( table: string, id: string ) => {
   const sql = connect();
   const query = `select * from ${ table } where sys_id = '${ id }' limit 1`;

   const [ res, err ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return err ? null : formatResult( res );
};


interface RecordQueryOptions {
   table: string;
   limit?: string;
   distinct?: string;
   column?: string;
   query?: string;
}
export const getRecordFromQuery = async ( connect: PostGresConnection, options: RecordQueryOptions ) => {
   console.log( options );

   const isDistinct = options.distinct ? options.distinct == "true" ? 'DISTINCT ' : '' : '';
   const columns = options.column || '*';
   const SELECT = `SELECT ${ isDistinct }${ columns }`;


   const table = options.table;
   const FROM = ` FROM ${ table }`;

   const LIMIT = options.limit ? ` LIMIT ${ options.limit }` : ``;

   const decodedQuery = options.query ? decodeEncodedQuery( options.query ) : '';
   const WHERE = options.query ? ` WHERE ${ decodedQuery }` : '';

   const sql = connect();
   let query = SELECT + FROM + WHERE + LIMIT;

   console.log( query );

   const [ res, err ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return err ? null : formatResult( res );
};


const decodeEncodedQuery = ( encodedQuery: string ) => {
   const mainDelimiters = /\^OR|\^(?!OR)/;
   const fieldDelimiters = /\=|LIKE/;
   const initialSplit = encodedQuery.split( mainDelimiters );

   const fieldSplit = initialSplit.map( x => {
      const [ delimiter, index, input, groups ] = x.match( fieldDelimiters ) as Array<any>;

      const firstOcc = x.search( fieldDelimiters );
      return x.slice( firstOcc + delimiter.length, x.length );
   } );

   const relevantValues = fieldSplit
      .filter( x => x.includes( ' ' ) && x.slice( 0 ) != "'" && x.slice( -1 ) != "'" );

   let predecodedQuery = encodedQuery;

   relevantValues.forEach( x => {
      predecodedQuery = predecodedQuery.replace( x, `'${ x }'` );
   } );

   const decodedQuery = predecodedQuery
      .replace( /(\^OR)/g, ' OR ' )
      .replace( /\^/g, ' AND ' );

   return decodedQuery;
};