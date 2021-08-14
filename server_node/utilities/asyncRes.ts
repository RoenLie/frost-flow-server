export async function asyncRes( promise: Promise<any>, catchCb?: Function, finallyCb?: Function ) {
   try {
      const data = await promise;
      return [ data, null ];
   } catch ( error ) {
      if ( catchCb ) catchCb();
      console.error( error );
      return [ null, error ];
   } finally {
      if ( finallyCb ) finallyCb();
   }
}

export async function asyncRes2( promiseGenerator: Function, query: string, catchCb?: Function, finallyCb?: Function ) {
   try {
      const data = await promiseGenerator( query );
      return [ data, null ];
   } catch ( error ) {
      if ( catchCb ) catchCb();
      console.error( error );
      return [ null, error ];
   } finally {
      if ( finallyCb ) finallyCb();
   }
}