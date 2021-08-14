import { asyncRes } from "../../utilities/asyncRes";
import { PostGresConnection } from "./connect";
import { formatResult } from "./formatResult";


export const getColumnsFromTable = async ( connect: PostGresConnection, table: string ) => {
   const sql = connect();
   let query = `select * from ${ table } where 1 = 0`;
   let [ res, resErr ] = await asyncRes( sql.unsafe( query ) );
   sql.end();

   if ( resErr ) return resErr;

   res = formatResult( res );
   return { result: res, error: resErr };
};
