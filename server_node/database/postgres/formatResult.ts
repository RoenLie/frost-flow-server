import types from "./types.enum";

export const formatResult = ( result: any ) => {
   result.columns.map( ( c: any ) => c.type = types[ c.type ] );

   if ( !result ) return null;

   return {
      data: result[ 0 ],
      columns: result.columns
   };
};