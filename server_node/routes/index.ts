import { Router } from 'express';
import dgraphRouter from "./dgraph.routes";
import mysqlRouter from "./mysql.routes";
import usersRouter from './user.routes';
import postgresRouter from './postgres.routes';

const router = Router();

router.use( '/users', usersRouter );
router.use( "/mysql", mysqlRouter );
router.use( "/dgraph", dgraphRouter );
router.use( "/postgres", postgresRouter );


export default router;