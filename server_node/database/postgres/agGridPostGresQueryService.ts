import postgres from "postgres";

class AgGridPostGressQueryService {
   table: string = "";
   select: string = "";
   from: string = "";
   where: string = "";
   groupBy: string = "";
   orderBy: string = "";
   limit: string = "";

   connect: () => postgres.Sql<{}>;

   constructor ( connect: () => postgres.Sql<{}>, table: string ) {
      this.from = `from ${ table }`;
      this.connect = connect;
      this.table = table;
   }

   async getData( request: any ) {
      const query = this.buildSql( request );

      console.log( query );

      const sql = this.connect();

      try {
         const results = await sql.unsafe( query );

         const lastRow = this.getRowCount( request, results );
         const rows = this.cutResultsToPageSize( request, results );

         return { rows, lastRow };
      } catch ( error ) {
         console.log( error );
      } finally {
         sql.end();
      }
   }

   buildSql( request: any ) {
      return [
         this.select = this.createSelect( request ),
         this.from,
         this.where = this.createWhere( request ),
         this.groupBy = this.createGroupBy( request ),
         this.orderBy = this.createOrderBy( request ),
         this.limit = this.createLimit( request )
      ].filter( x => x ).join( " " ) + ";";
   }

   createSelect( request: any ) {
      const rowGroupCols = request.rowGroupCols;
      const valueCols = request.valueCols;
      const groupKeys = request.groupKeys;

      if ( !this.isDoingGrouping( rowGroupCols, groupKeys ) ) return "select *";

      const colsToSelect = [];

      const rowGroupCol = rowGroupCols[ groupKeys.length ];
      colsToSelect.push( rowGroupCol.field );

      valueCols.forEach( function ( valueCol: any ) {
         colsToSelect.push( `${ valueCol.aggFunc } (${ valueCol.field }) as ${ valueCol.field }` );
      } );

      return `select ${ colsToSelect.join( ", " ) }`;
   }

   createWhere( request: any ) {
      const rowGroupCols = request.rowGroupCols;
      const groupKeys = request.groupKeys || [];
      const filterModel = request.filterModel;

      const that = this;
      const whereParts: any = [];

      if ( groupKeys.length > 0 ) {
         groupKeys.forEach( ( key: any, index: any ) => {
            const colName = rowGroupCols[ index ].field;
            whereParts.push( `${ colName } = '${ key }'` );
         } );
      }

      if ( filterModel ) {
         const keySet = Object.keys( filterModel );
         keySet.forEach( ( key ) => {
            const item = filterModel[ key ];
            whereParts.push( that.createFilter( key, item ) );
         } );
      }

      if ( !whereParts.length ) return "";

      return `where ${ whereParts.join( " and " ) }`;
   }

   createFilter( key: any, item: any ) {
      switch ( item.filterType ) {
         case "text":
            return this.createTextFilter( key, item );
         case "number":
            return this.createNumberFilter( key, item );
         case "set":
            return this.createSetFiler( key, item );
         default:
            console.log( `unknown filter type: ${ item.filterType }` );
      }
   }

   createSetFiler( key: any, item: any ) {
      return `${ key } IN('${ item.values.join( "','" ) }')`;
   }

   createNumberFilter( key: any, item: any ) {
      switch ( item.type ) {
         case "equals":
            return key + " = " + item.filter;
         case "notEqual":
            return key + " != " + item.filter;
         case "greaterThan":
            return key + " > " + item.filter;
         case "greaterThanOrEqual":
            return key + " >= " + item.filter;
         case "lessThan":
            return key + " < " + item.filter;
         case "lessThanOrEqual":
            return key + " <= " + item.filter;
         case "inRange":
            return "(" + key + " >= " + item.filter + " and " + key + " <= " + item.filterTo + ")";
         default:
            console.log( "unknown number filter type: " + item.type );
            return "true";
      }
   }

   createTextFilter( key: any, item: any ) {

      if ( item?.operator ) {
         const entries = Object.entries( item )
            .filter( entry => entry[ 0 ].includes( "condition" ) )
            .map( entry => entry[ 1 ] );

         const filter: string[] = entries.map( c => this.createTextFilter( key, c ) );

         return filter.join( ` ${ item.operator } ` );
      }

      switch ( item.type ) {
         case "equals":
            return `${ key } = '${ item.filter }'`;
         case "notEqual":
            return `${ key } != '${ item.filter }'`;
         case "contains":
            return `${ key } ilike '%${ item.filter }%'`;
         case "notContains":
            return `${ key } not ilike '%${ item.filter }%'`;
         case "startsWith":
            return `${ key } like '${ item.filter }%'`;
         case "endsWith":
            return `${ key } like '%${ item.filter }'`;
         default:
            console.log( `unknown text filter type: ${ item.type }` );
            return "true";
      }
   }

   createLimit( request: any ) {
      const { startRow, endRow } = request;

      if ( !startRow && !endRow ) return "";

      const pageSize = endRow - startRow;
      return "limit " + ( pageSize + 1 ) + " offset " + startRow;
   }

   createOrderBy( request: any ) {
      const { sortModel, rowGroupCols, groupKeys } = request;
      console.log( request );

      const grouping = this.isDoingGrouping( rowGroupCols, groupKeys );

      const sortParts: any = [];
      if ( sortModel ) {
         const groupColIds = rowGroupCols
            ?.map( ( groupCol: any ) => groupCol.id )
            .slice( 0, groupKeys.length + 1 );

         sortModel.forEach( ( item: any ) => {
            if ( grouping && !groupColIds.includes( item.colId ) ) return;
            sortParts.push( `${ item.colId } ${ item.sort }` );
         } );
      }

      if ( sortParts.length <= 0 ) return "";

      return `order by ${ sortParts.join( ", " ) }`;
   }

   createGroupBy( request: any ) {
      const { rowGroupCols, groupKeys } = request;

      // select all columns
      if ( !this.isDoingGrouping( rowGroupCols, groupKeys ) ) return "";

      // perform grouping
      const colsToGroupBy = [];

      const rowGroupCol = rowGroupCols[ groupKeys.length ];
      colsToGroupBy.push( rowGroupCol.field );

      return `group by ${ colsToGroupBy.join( ", " ) }`;
   }

   isDoingGrouping( rowGroupCols: any, groupKeys: any ) {
      // we are not doing grouping if at the lowest level. we are at the lowest level
      // if we are grouping by more columns than we have keys for (that means the user
      // has not expanded a lowest level group, OR we are not grouping at all).
      return rowGroupCols?.length > groupKeys?.length;
   }

   getRowCount( request: any, results: any ) {
      if ( !results ) return null;

      const currentLastRow = request.startRow + results.length;

      return currentLastRow <= request.endRow ? currentLastRow : -1;
   }

   cutResultsToPageSize( request: any, results: any ) {
      const pageSize = request.endRow - request.startRow;

      if ( !results || results.length < pageSize ) return results;

      return results.splice( 0, pageSize );
   }

   async getSetFilter( { field }: any ) {
      const sql = this.connect();

      try {
         const results = await sql.unsafe(
            `SELECT DISTINCT ${ field } FROM ${ this.table } ORDER BY ${ field } ASC`
         );
         return results?.map( ( x: any ) => x[ field ] );
      } catch ( error ) {
         console.log( error );
      } finally {
         sql.end();
      }
   }
}

export { AgGridPostGressQueryService };