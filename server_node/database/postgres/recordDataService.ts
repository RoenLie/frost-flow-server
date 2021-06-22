import { connect } from "./connect";
import { formatResult } from "./formatResult";

export const getDatabaseTypes = async () => {
   const sql = connect();

   try {
      const types = await sql`SELECT oid, typname FROM pg_type`;

      const formattedTypes = types.reduce( ( prev, cur ) => {
         prev[ cur.oid ] = cur.typname;

         return prev;
      }, {} );

      return formattedTypes;
   } catch ( error ) {
      console.log( error );
   } finally {
      sql.end();
   }
};

export const getRecordByTableAndId = async ( table: string, id: string ) => {

   const sql = connect();

   console.log( table, id );

   const query = `select * from ${ table } where sys_id = '${ id }' limit 1`;

   try {
      const result = await sql.unsafe( query );
      return formatResult( result );
   } catch ( error ) {
      console.log( error );
      return null;
   } finally {
      sql.end();
   }
};