import postgres from "postgres";

export type PostGresConnection = () => postgres.Sql<{}>;

export const connect = () => postgres( {
   host: "localhost",
   port: 5432,
   username: "roen",
   password: "roen",
   database: "frostflow"
} ) as postgres.Sql<{}>;