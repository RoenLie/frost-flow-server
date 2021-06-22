import { Router } from 'express';

const usersRouter = Router();

usersRouter.get( '/', ( request: any, response: any ): void => {
   return response.json( "OK" );
} );

export default usersRouter;