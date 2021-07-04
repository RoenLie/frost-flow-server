/**
 * Function for setting static path dynamicly.
 * @param {String} path path to distribution location
 */
export const createDynStatic = ( express: any, path: string ) => {
   let staticPath = express.static( path );

   const dyn = ( req: any, res: any, next: any ) => staticPath( req, res, next );

   dyn.setPath = ( newPath: string ) => {
      staticPath = express.static( newPath );
   };

   return dyn;
};