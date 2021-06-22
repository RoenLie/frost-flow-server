export async function asyncRes( promise: Promise<any>, finallyCb?: Function ) {
   try {
      const data = await promise;
      return [ data, null ];
   } catch ( error ) {
      console.error( error );
      return [ null, error ];
   } finally {
      if ( finallyCb )
         finallyCb();
   }
}