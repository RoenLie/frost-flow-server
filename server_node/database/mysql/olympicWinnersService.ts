import mariadb from "mariadb";


class OlympicWinnersService {

   async getData( request: any, resultsCallback: any ) {
      const SQL = this.buildSql( request );

      const connection = await mariadb.createConnection( {
         host: "localhost",
         port: 3306,
         user: "root",
         password: "root",
         database: "sample_data"
      } );

      try {
         var results = await connection.query( SQL );
      } catch ( error ) {
         console.log( error );
      } finally {
         connection.end();
      }

      const rowCount = this.getRowCount( request, results );
      const resultsForPage = this.cutResultsToPageSize( request, results );

      resultsCallback( resultsForPage, rowCount );
   }

   buildSql( request: any ) {
      const selectSql = this.createSelectSql( request );
      const fromSql = " FROM olympic_winners";
      const whereSql = this.createWhereSql( request );
      const limitSql = this.createLimitSql( request );

      const orderBySql = this.createOrderBySql( request );
      const groupBySql = this.createGroupBySql( request );

      const SQL = selectSql + fromSql + whereSql + groupBySql + orderBySql + limitSql;

      console.log( SQL );

      return SQL;
   }

   createSelectSql( request: any ) {
      const rowGroupCols = request.rowGroupCols;
      const valueCols = request.valueCols;
      const groupKeys = request.groupKeys;

      if ( !this.isDoingGrouping( rowGroupCols, groupKeys ) ) return ' select *';

      const colsToSelect = [];

      const rowGroupCol = rowGroupCols[ groupKeys.length ];
      colsToSelect.push( rowGroupCol.field );

      valueCols.forEach( function ( valueCol: any ) {
         colsToSelect.push( valueCol.aggFunc + '(' + valueCol.field + ') as ' + valueCol.field );
      } );

      return ' select ' + colsToSelect.join( ', ' );
   }

   createFilterSql( key: any, item: any ) {
      switch ( item.filterType ) {
         case 'text':
            return this.createTextFilterSql( key, item );
         case 'number':
            return this.createNumberFilterSql( key, item );
         case "set":
            return this.createSetFilerSql( key, item );
         default:
            console.log( 'unknown filter type: ' + item.filterType );
      }
   }

   createNumberFilterSql( key: any, item: any ) {
      switch ( item.type ) {
         case 'equals':
            return key + ' = ' + item.filter;
         case 'notEqual':
            return key + ' != ' + item.filter;
         case 'greaterThan':
            return key + ' > ' + item.filter;
         case 'greaterThanOrEqual':
            return key + ' >= ' + item.filter;
         case 'lessThan':
            return key + ' < ' + item.filter;
         case 'lessThanOrEqual':
            return key + ' <= ' + item.filter;
         case 'inRange':
            return '(' + key + ' >= ' + item.filter + ' and ' + key + ' <= ' + item.filterTo + ')';
         default:
            console.log( 'unknown number filter type: ' + item.type );
            return 'true';
      }
   }

   createTextFilterSql( key: any, item: any ) {

      if ( item?.operator ) {
         const entries = Object.entries( item )
            .filter( entry => entry[ 0 ].includes( "condition" ) )
            .map( entry => entry[ 1 ] );

         const filter: string[] = entries.map( condition => this.createTextFilterSql( key, condition ) );

         return filter.join( " " + item.operator + " " );
      }

      switch ( item.type ) {
         case "equals":
            return `${ key } = '${ item.filter }'`;
         case "notEqual":
            return `${ key } != '${ item.filter }'`;
         case "contains":
            return `${ key } like '%${ item.filter }%'`;
         case "notContains":
            return `${ key } not like '%${ item.filter }%'`;
         case "startsWith":
            return `${ key } like '${ item.filter }%'`;
         case "endsWith":
            return `${ key } like '%${ item.filter }'`;
         default:
            console.log( "unknown text filter type:", item.type );
            return "true";
      }
   }

   createSetFilerSql( key: any, item: any ) {
      return `${ key } IN('${ item.values.join( "','" ) }')`;
   }

   createWhereSql( request: any ) {
      const rowGroupCols = request.rowGroupCols;
      const groupKeys = request.groupKeys || [];
      const filterModel = request.filterModel;

      const that = this;
      const whereParts: any = [];

      if ( groupKeys.length > 0 ) {
         groupKeys.forEach( function ( key: any, index: any ) {
            const colName = rowGroupCols[ index ].field;
            whereParts.push( `${ colName } = '${ key }'` );
         } );
      }

      if ( filterModel ) {
         const keySet = Object.keys( filterModel );
         keySet.forEach( function ( key ) {
            const item = filterModel[ key ];
            whereParts.push( that.createFilterSql( key, item ) );
         } );
      }

      if ( !whereParts.length ) return '';

      return ' where ' + whereParts.join( ' and ' );
   }

   createGroupBySql( request: any ) {
      const { rowGroupCols, groupKeys } = request;

      // select all columns
      if ( !this.isDoingGrouping( rowGroupCols, groupKeys ) ) return '';

      // perform grouping
      const colsToGroupBy = [];

      const rowGroupCol = rowGroupCols[ groupKeys.length ];
      colsToGroupBy.push( rowGroupCol.field );

      return ' group by ' + colsToGroupBy.join( ', ' );
   }

   createOrderBySql( request: any ) {
      const { sortModel, rowGroupCols, groupKeys } = request;

      const grouping = this.isDoingGrouping( rowGroupCols, groupKeys );

      const sortParts: any = [];
      if ( sortModel ) {
         const groupColIds = rowGroupCols
            ?.map( ( groupCol: any ) => groupCol.id )
            .slice( 0, groupKeys.length + 1 );

         sortModel.forEach( ( item: any ) => {
            if ( !grouping && groupColIds?.indexOf( item.colId ) > -1 ) return;
            sortParts.push( item.colId + ' ' + item.sort );
         } );
      }

      if ( sortParts.length <= 0 ) return '';

      return ' order by ' + sortParts.join( ', ' );
   }

   isDoingGrouping( rowGroupCols: any, groupKeys: any ) {
      // we are not doing grouping if at the lowest level. we are at the lowest level
      // if we are grouping by more columns than we have keys for (that means the user
      // has not expanded a lowest level group, OR we are not grouping at all).
      return rowGroupCols?.length > groupKeys?.length;
   }

   createLimitSql( request: any ) {
      const { startRow, endRow } = request;
      if ( !startRow || !endRow ) return "";

      const pageSize = endRow - startRow;
      return ' limit ' + ( pageSize + 1 ) + ' offset ' + startRow;
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

   async getCountries( request: any, res: any ) {
      const connection = await mariadb.createConnection( {
         host: "localhost",
         port: 3306,
         user: "root",
         password: "root",
         database: "sample_data"
      } );

      var SQL = 'SELECT DISTINCT country FROM olympic_winners ORDER BY country ASC';

      try {
         var results = await connection.query( SQL );
      } catch ( error ) {
         console.log( error );
      } finally {
         connection.end();
      }

      return results?.map( ( x: any ) => x.country );
   }
}

export default new OlympicWinnersService();