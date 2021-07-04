import types from "./types.enum";

export const formatResult = ( result: any ) => {
   result.columns.map( ( c: any ) => c.type = types[ c.type ] );

   return !result ? null : {
      // data: result.length > 1 ? result : result[ 0 ],
      data: result,
      columns: result.columns
   };
};