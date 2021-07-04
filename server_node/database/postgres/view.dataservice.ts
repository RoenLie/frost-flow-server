import { asyncRes, asyncRes2 } from "../../utilities/asyncRes";
import { PostGresConnection } from "./connect";
import { formatResult } from "./formatResult";
import { ViewFieldQueryOptions, ViewObject, ViewOptions, ViewQueryOptions, ViewSection, ViewSectionQueryOptions } from "./types.view.dataservice";


export const getView = async ( connect: PostGresConnection, options: ViewQueryOptions ) => {
   const sql = connect();
   let query = `SELECT * FROM view`;

   const { tableName, sysId } = options;
   if ( tableName || sysId ) {
      query += ` WHERE`;

      const queryArr = [
         tableName ? ` table_name = '${ tableName }'` : '',
         sysId ? ` sys_id = '${ sysId }'` : ''
      ];

      query += queryArr.join( ' AND ' );
   }

   const [ viewResult, viewErr ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return viewErr ? null : formatResult( viewResult );
};


export const getViewSection = async ( connect: PostGresConnection, options: ViewSectionQueryOptions ) => {
   const sql = connect();
   let query = `SELECT * FROM view_section`;

   const { viewId, sysId } = options;
   if ( viewId || sysId ) {
      query += ` WHERE`;

      const queryArr = [
         viewId ? ` view_id = '${ viewId }'` : '',
         sysId ? ` sys_id = '${ sysId }'` : ''
      ];

      query += queryArr.join( ' AND ' );
   }

   const [ viewResult, viewErr ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return viewErr ? null : formatResult( viewResult );
};

export const getViewField = async ( connect: PostGresConnection, options: ViewFieldQueryOptions ) => {
   const sql = connect();
   let query = `SELECT * FROM view_field`;

   const { columnName, sectionId } = options;
   if ( columnName || sectionId ) {
      query += ` WHERE`;

      const queryArr = [
         columnName ? ` column_name='${ columnName }'` : '',
         sectionId ? ` section_id='${ sectionId }'` : ''
      ];

      query += queryArr.join( ' AND ' );
   }

   const [ viewResult, viewErr ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return viewErr ? null : formatResult( viewResult );
};

export const getComposedView = async ( connect: PostGresConnection, options: ViewOptions ) => {
   const sql = connect();
   const view: ViewObject = { view: {}, section: [], field: [], validation: [] };

   // ----------------------------

   let query = `SELECT * FROM view`;
   query += ` WHERE table_name = '${ options.table }'`;
   query += options.viewType ? ` AND view_type = '${ options.viewType }'` : '';
   query += options.name ? ` AND name = '${ options.name }'` : '';

   const [ viewResult, viewErr ] = await asyncRes2( sql.unsafe, query );
   if ( viewErr ) return null;

   view.view = viewResult.find( ( v: any ) =>
      !options.name ? v.name == 'default' : v.name == options.name );

   // ----------------------------

   query = `SELECT * FROM view_section`;
   query += ` WHERE view_id = '${ view.view?.sys_id }'`;

   const [ sectionRes, sectionErr ] = await asyncRes2( sql.unsafe, query );
   if ( sectionErr ) return null;

   view.section = sectionRes.sort( ( a: any, b: any ) => a.order - b.order );

   // ----------------------------

   query = `SELECT * FROM view_field`;
   query += ` WHERE section_id  IN('${ view.section.map( s => s.sys_id ).join( "','" ) }')`;

   const [ fieldRes, fieldErr ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   if ( fieldErr ) return null;

   view.field = fieldRes.reduce( ( carry: any, current: any ) => {
      if ( !carry[ current.section_id ] ) carry[ current.section_id ] = [];
      carry[ current.section_id ].push( current );

      return carry;
   }, {} );

   // ----------------------------

   return view;
};


export const upsertSection = async ( connect: PostGresConnection, sectionData: ViewSection ) => {
   const sql = connect();

   const objEntries = Object.entries( sectionData ).filter( s => !s[ 0 ].includes( "sys_" ) );
   const columns = objEntries.map( e => e[ 0 ] );
   const values = objEntries.map( e => {
      if ( isNaN( e[ 1 ] ) ) return `'${ e[ 1 ] }'`;
      return e[ 1 ];
   } );

   let query = "";
   if ( sectionData.sys_id ) {
      query = `UPDATE view_section`;
      query += ` SET ${ columns.map( ( c, i ) => `${ c } = ${ values[ i ] }` ).join( "," ) }`;
      query += ` WHERE sys_id = ${ sectionData.sys_id }`;
   } else {
      query = `INSERT INTO view_section(${ columns.join( "," ) })`;
      query += ` VALUES(${ values.join( "," ) })`;
   }

   const [ res, err ] = await asyncRes2( sql.unsafe, query, () => sql.end() );
   return err ? null : true;
};