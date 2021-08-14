import { asyncRes, asyncRes2 } from "../../utilities/asyncRes";
import { PostGresConnection } from "./connect";
import { formatResult } from "./formatResult";
import { getColumnsFromTable } from "./getColumnsFromTable";
import {
   View,
   ViewField,
   ViewFieldQueryOptions, ViewFields, ViewObject, ViewOptions,
   ViewQueryOptions, ViewSection, ViewSectionQueryOptions
} from "./types.view.dataservice";


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

   const view: ViewObject = {
      view: {} as View,
      section: [],
      field: {} as ViewFields,
      columns: [],
      validation: []
   };

   // ----------------------------

   const { result: columnResult, error: columnError } = await getColumnsFromTable( connect, options.table );
   if ( columnError ) return view;
   view.columns = columnResult.columns;

   // ----------------------------

   let query = `SELECT * FROM view`;
   query += ` WHERE table_name = '${ options.table }'`;
   query += options.name ? ` AND name = '${ options.name }'` : '';
   query += options.viewType ? ` AND view_type = '${ options.viewType }'` : '';

   const [ viewResult, viewErr ] = await asyncRes( sql.unsafe( query ), () => sql.end() );
   if ( viewErr ) return view;

   view.view = viewResult.find( ( v: any ) =>
      !options.name ? v.name == 'default' : v.name == options.name );

   // ----------------------------

   query = `SELECT * FROM view_section`;
   query += ` WHERE view_id = '${ view.view?.sys_id }'`;

   const [ sectionRes, sectionErr ] = await asyncRes( sql.unsafe( query ), () => sql.end() );
   if ( sectionErr || !sectionRes.length ) return view;

   view.section = sectionRes.sort( ( a: any, b: any ) => a.order - b.order );

   // ----------------------------

   query = `SELECT * FROM view_field`;
   query += ` WHERE section_id IN ('${ view.section.map( s => s.sys_id ).join( "','" ) }')`;

   const [ fieldRes, fieldErr ] = await asyncRes( sql.unsafe( query ), () => sql.end() );
   if ( fieldErr ) return view;

   view.field = fieldRes.reduce( ( carry: any, current: any ) => {
      if ( !carry[ current.section_id ] ) carry[ current.section_id ] = [];
      carry[ current.section_id ].push( current );

      return carry;
   }, {} );

   // ----------------------------

   sql.end();
   return view;
};

export const upsertComposedView = async ( connect: PostGresConnection, data: ViewObject ) => {
   const sql = connect();

   /* Upsert any view changes.
    */
   const viewRes = await upsertView( connect, data.view ) as View;
   if ( !viewRes ) return null;

   /* Append the correct view_id from the view to the section.
   */
   data.section = data.section.map( ( s: ViewSection ) => {
      s.view_id = viewRes.sys_id;
      return s;
   } );

   /* Get all current sections belonging to this view.
   */
   let getSecQuery = `SELECT * FROM view_section`;
   getSecQuery += ` WHERE view_id = '${ viewRes.sys_id }'`;

   const [ existingSections, extSecErr ] =
      await asyncRes( sql.unsafe( getSecQuery ), sql.end );
   if ( extSecErr ) return null;

   /* Find which sections no longer exist and that should be deleted. 
    */
   const sectionsToDelete: ViewSection[] = existingSections
      .reduce( ( acc: ViewSection[], cur: ViewSection ) => {
         if ( !data.section.some( sec => sec.sys_id == cur.sys_id ) )
            acc.push( cur );

         return acc;
      }, [] );

   /* Delete any sections that do not appear in the new object.
      Also deletes any fields connected to the deleted section.
    */
   if ( sectionsToDelete.length ) {
      let delFldQuery = `DELETE FROM view_field`;
      delFldQuery += ` WHERE section_id IN ('`;
      delFldQuery += sectionsToDelete.map( s => s.sys_id ).join( "','" );
      delFldQuery += `')`;

      const [ delFields, delFieldsErr ] =
         await asyncRes( sql.unsafe( delFldQuery ), sql.end );
      if ( delFieldsErr ) return null;

      let delSecQuery = `DELETE FROM view_section`;
      delSecQuery += ` WHERE sys_id IN ('`;
      delSecQuery += sectionsToDelete.map( s => s.sys_id ).join( "','" );
      delSecQuery += `')`;

      const [ delSections, delSectionsErr ] =
         await asyncRes( sql.unsafe( delSecQuery ), sql.end );
      if ( delSectionsErr ) return null;
   }

   /* Clear fields connected to the deleted section.
    */
   sectionsToDelete.forEach( s => {
      if ( !data.field[ s.sys_id ] ) return;
      data.field[ s.sys_id ] = [] as any;
   } );

   /* Upsert changes to all sections connected to this view.
    */
   const sectionRes: ViewSection[] =
      await Promise.all( data.section.map( s => upsertSection( connect, s ) ) );
   if ( !sectionRes.length ) return null;

   /* Insert the fields from client side into the correct backend sys_id section.
    */
   const validatedFields = {} as { [ key: string ]: any; };
   sectionRes.forEach( sec => {
      validatedFields[ sec.sys_id ] = data.field[ sec.initialId ];
   } );

   /* Find fields in all sections and find the ones that should be deleted.
    */
   const fieldsToDelete = [] as ViewField[];
   for ( const sec of sectionRes ) {
      let query = `SELECT sys_id FROM view_field`;
      query += ` WHERE section_id = '${ sec.sys_id }'`;

      const [ exiFieldRes, exiFieldResErr ] = await asyncRes( sql.unsafe( query ), sql.end );
      if ( exiFieldResErr ) return null;

      fieldsToDelete.push(
         ...exiFieldRes.reduce( ( acc: ViewField[], cur: ViewField ) => {
            if ( !data.field[ sec.sys_id ].some( fld => fld.sys_id == cur.sys_id ) )
               acc.push( cur );

            return acc;
         }, [] )
      );
   }

   /* Delete any fields that do not appear in any of the sections submitted.
   */
   if ( fieldsToDelete.length ) {
      let delFldQuery = `DELETE FROM view_field`;
      delFldQuery += ` WHERE sys_id IN ('`;
      delFldQuery += fieldsToDelete.map( f => f.sys_id ).join( "','" );
      delFldQuery += `')`;

      const [ delFields, delFieldsErr ] =
         await asyncRes( sql.unsafe( delFldQuery ), sql.end );
      if ( delFieldsErr ) return null;
   }

   /* Upsert all fields in all sections connected to the view.
    */
   const fieldRes = {} as { [ key: string ]: any; };
   for ( const id in validatedFields ) {
      if ( !validatedFields[ id ]?.length ) continue;

      fieldRes[ id ] = await Promise.all( validatedFields[ id ].map( ( fData: ViewField ) => {
         fData.section_id = id;
         return upsertField( connect, fData );
      } ) );
   }

   sql.end();

   return true;
};

export const upsertView = async ( connect: PostGresConnection, data: View ) => {
   const sql = connect();

   const editableColumns = [ 'name', 'table_name', 'view_type' ];

   let query = `SELECT * FROM view`;
   query += ` WHERE sys_id = '${ data.sys_id }'`;

   const [ view, viewErr ] = await asyncRes( sql.unsafe( query ), sql.end );
   if ( viewErr ) return null;

   query = '';
   if ( view.count ) {
      query = `UPDATE view`;
      query += ` SET ${ editableColumns.map( c => `${ c } = '${ data[ c ] }'` ).join( ',' ) }`;
      query += ` WHERE sys_id = '${ data.sys_id }'`;
      query += ` RETURNING *;`;
   } else {
      query = `INSERT INTO view(${ editableColumns.join( ',' ) })`;
      query += ` VALUES(${ editableColumns.map( c => data[ c ] ).join( ',' ) })`;
      query += ` RETURNING *;`;
   }

   const [ viewUpsertRes, viewUpsertErr ] =
      await asyncRes( sql.unsafe( query ), sql.end, sql.end );
   if ( viewUpsertErr ) return null;

   return viewUpsertRes[ 0 ];
};

export const upsertSection = async ( connect: PostGresConnection, data: ViewSection ) => {
   const sql = connect();

   const editableColumns = [ 'grid_height', 'grid_width', 'name', 'section_order', 'view_id' ];

   let query = `SELECT * FROM view_section`;
   query += ` WHERE sys_id = '${ data.sys_id }'`;

   const [ section, sectionErr ] = await asyncRes( sql.unsafe( query ), sql.end );
   if ( sectionErr ) return null;

   query = '';
   if ( section.count ) {
      query = `UPDATE view_section`;
      query += ` SET ${ editableColumns.map( c => `${ c } = '${ data[ c ] }'` ).join( ',' ) }`;
      query += ` WHERE sys_id = '${ data.sys_id }'`;
      query += ` RETURNING *;`;
   } else {
      query = `INSERT INTO view_section(${ editableColumns.join( ',' ) })`;
      query += ` VALUES(${ editableColumns.map( c => {
         if ( isNaN( data[ c ] ) ) return `'${ data[ c ] }'`;
         return data[ c ];
      } ).join( ',' ) })`;
      query += ` RETURNING *;`;
   }

   const [ sectionUpsertRes, sectionUpsertErr ] =
      await asyncRes( sql.unsafe( query ), sql.end, sql.end );
   if ( sectionUpsertErr ) return null;

   const resData = sectionUpsertRes[ 0 ];
   resData.initialId = data.sys_id;

   return resData;
};

export const upsertField = async ( connect: PostGresConnection, data: ViewField ) => {
   const sql = connect();

   const editableColumns = [
      'grid_x_from', 'grid_x_to',
      'grid_y_from', 'grid_y_to',
      'column_name', 'label',
      'section_id'
   ];

   let query = `SELECT * FROM view_field`;
   query += ` WHERE sys_id = '${ data.sys_id }'`;

   const [ field, fieldErr ] = await asyncRes( sql.unsafe( query ), sql.end );
   if ( fieldErr ) return null;

   query = '';
   if ( field.count ) {
      query = `UPDATE view_field`;
      query += ` SET ${ editableColumns.map( c => `${ c } = '${ data[ c ] }'` ).join( ',' ) }`;
      query += ` WHERE sys_id = '${ data.sys_id }'`;
      query += ` RETURNING *;`;
   } else {
      query = `INSERT INTO view_field(${ editableColumns.join( ',' ) })`;
      query += ` VALUES(${ editableColumns.map( c => {
         if ( isNaN( data[ c ] ) ) return `'${ data[ c ] }'`;
         return data[ c ];
      } ).join( ',' ) })`;
      query += ` RETURNING *;`;
   }

   const [ fieldUpsertRes, fieldUpsertErr ] =
      await asyncRes( sql.unsafe( query ), sql.end, sql.end );
   if ( fieldUpsertErr ) return null;

   const resData = fieldUpsertRes[ 0 ];

   return resData;
};