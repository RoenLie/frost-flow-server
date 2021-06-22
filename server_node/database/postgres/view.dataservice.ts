import postgres from "postgres";
import { asyncRes } from "../../utilities/asyncRes";
import { formatResult } from "./formatResult";

type ViewType = "record" | "list";

interface View {
   readonly sys_id: string;
   readonly sys_created_at: string;
   readonly sys_updated_at: string;
   name: string;
   table_name: string;
   view_type: ViewType;
}

interface ViewSection {
   readonly sys_id?: string;
   readonly sys_created_at?: string;
   readonly sys_updated_at?: string;
   view_id?: string;
   section_id?: string;
   name: string;
   grid_width?: number;
   grid_height?: number;
   grid_x_from?: number;
   grid_x_to?: number;
   grid_y_from?: number;
   grid_y_to?: number;
   section_order?: number;
}

interface ViewField {
   readonly sys_id: string;
   readonly sys_created_at: string;
   readonly sys_updated_at: string;
   section_id: string;
   column_name: string;
   label: string;
   grid_x_from: number;
   grid_x_to: number;
   grid_y_from: number;
   grid_y_to: number;
}

interface ViewOptions {
   table: string;
   name?: string | undefined;
   viewType?: string | undefined;
}

interface ViewObject {
   view: any;
   section: any[];
   field: any;
   validation?: any;
}


export const getView = async ( connect: () => postgres.Sql<{}>, options: ViewOptions ) => {
   const sql = connect();
   const view: ViewObject = { view: {}, section: [], field: [], validation: [] };

   // ----------------------------

   let query = `SELECT * FROM view`;
   query += ` WHERE table_name = '${ options.table }'`;
   query += options.viewType ? ` AND view_type = '${ options.viewType }'` : '';
   query += options.name ? ` AND name = '${ options.name }'` : '';

   const [ viewResult, viewErr ] = await asyncRes( sql.unsafe( query ) );
   if ( viewErr ) return null;

   view.view = viewResult.find( ( v: any ) =>
      !options.name ? v.name == 'default' : v.name == options.name );

   // ----------------------------

   query = `SELECT * FROM view_section`;
   query += ` WHERE view_id = '${ view.view?.sys_id }'`;

   const [ sectionRes, sectionErr ] = await asyncRes( sql.unsafe( query ) );
   if ( sectionErr ) return null;

   view.section = sectionRes.sort( ( a: any, b: any ) => a.order - b.order );

   // ----------------------------

   query = `SELECT * FROM view_field`;
   query += ` WHERE section_id  IN('${ view.section.map( s => s.sys_id ).join( "','" ) }')`;

   const [ fieldRes, fieldErr ] = await asyncRes( sql.unsafe( query ), () => sql.end() );
   if ( fieldErr ) return null;

   view.field = fieldRes.reduce( ( carry: any, current: any ) => {
      if ( !carry[ current.section_id ] ) carry[ current.section_id ] = [];
      carry[ current.section_id ].push( current );

      return carry;
   }, {} );

   // ----------------------------

   return view;
};

export const getView_es6 = async ( connect: () => postgres.Sql<{}>, options: ViewOptions ) => {
   const sql = connect();
   const view: ViewObject = { view: {}, section: [], field: [], validation: [] };

   // ----------------------------

   let query = `SELECT * FROM view`;
   query += ` WHERE table_name = '${ options.table }'`;
   query += options.viewType ? ` AND view_type = '${ options.viewType }'` : '';
   query += options.name ? ` AND name = '${ options.name }'` : '';

   let viewResult;
   try {
      viewResult = await sql.unsafe( query );
   } catch ( error ) {
      console.error( error );
      return null;
   }

   view.view = viewResult.find( ( v: any ) =>
      !options.name ? v.name == 'default' : v.name == options.name );

   // ----------------------------

   query = `SELECT * FROM view_section`;
   query += ` WHERE view_id = '${ view.view?.sys_id }'`;

   let sectionRes;
   try {
      sectionRes = await sql.unsafe( query );
   } catch ( error ) {
      console.error( error );
      return null;
   }

   view.section = sectionRes.sort( ( a: any, b: any ) => a.order - b.order );

   // ----------------------------

   query = `SELECT * FROM view_field`;
   query += ` WHERE section_id  IN('${ view.section.map( s => s.sys_id ).join( "','" ) }')`;

   let fieldRes;
   try {
      fieldRes = await sql.unsafe( query );
   } catch ( error ) {
      console.error( error );
      return null;
   } finally {
      sql.end();
   }

   view.field = fieldRes.reduce( ( carry: any, current: any ) => {
      if ( !carry[ current.section_id ] ) carry[ current.section_id ] = [];
      carry[ current.section_id ].push( current );

      return carry;
   }, {} );

   // ----------------------------

   return view;
};

export function getView_es5( connect: () => postgres.Sql<{}>, options: ViewOptions ) {
   var sql = connect();
   var view: ViewObject = { view: {}, section: [], field: [], validation: [] };

   var query = "SELECT * FROM view";
   query += " WHERE table_name = '" + options.table + "'";
   query += options.viewType ? " AND view_type = '" + options.viewType + "'" : "";
   query += options.name ? " AND name = '" + options.name + "'" : "";

   return sql.unsafe( query )
      .then( function ( viewRes ) {
         var viewIndex = viewRes.findIndex( function ( v ) {
            return !options.name ? v.name == 'default' : v.name == options.name;
         } );

         view.view = viewRes[ viewIndex ];

         query = "SELECT * FROM view_section";
         query += " WHERE view_id = '" + view.view.sys_id + "'";

         return sql.unsafe( query );
      } )
      .catch( function ( err ) {
         console.error( err );
         return null;
      } )
      .then( function ( sectionRes ) {
         if ( !sectionRes ) return sectionRes;

         view.section = sectionRes.sort( function ( a: any, b: any ) {
            return a.order - b.order;
         } );

         var inValues = view.section.map( function ( s ) { return s.sys_id; } ).join( "','" );

         query = "SELECT * FROM view_field";
         query += " WHERE section_id IN('" + inValues + "')";

         return sql.unsafe( query );
      } )
      .catch( function ( err ) {
         console.error( err );
         return null;
      } )
      .then( function ( fieldRes ) {
         if ( !fieldRes ) return fieldRes;

         view.field = fieldRes.reduce( function ( carry: any, current: any ) {
            if ( !carry[ current.section_id ] ) carry[ current.section_id ] = [];

            carry[ current.section_id ].push( current );

            return carry;
         }, {} );

         return view;
      } )
      .catch( function ( err ) {
         console.error( err );
         return null;
      } )
      .finally( function () {
         sql.end();
      } );
};

export const upsertSection = async ( connect: () => postgres.Sql<{}>, sectionData: ViewSection ) => {
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

   const [ res, error ] = await asyncRes( sql.unsafe( query ), () => sql.end() );
   if ( error ) return null;

   return true;
};