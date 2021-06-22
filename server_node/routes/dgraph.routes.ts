import { Router } from 'express';
import dgraph from "dgraph-js";

const router = Router();


router.get( "/", async ( request: any, response: any ) => {
   return response.json( "Welcome to dgraph api" );
} );

router.get( "/init", async ( request: any, response: any ) => {
   const dgraphClientStub = newClientStub();
   const dgraphClient = newClient( dgraphClientStub );

   await dropAll( dgraphClient );
   await setSchema( dgraphClient );
   await createData( dgraphClient );
   await queryData( dgraphClient );
   await dropData( dgraphClient );
   await queryData( dgraphClient );
   await createData( dgraphClient );
   await queryData( dgraphClient );

   dgraphClientStub.close();
   return response.json( "dgraph initialized" );
} );

export default router;


// Create a client stub.
function newClientStub() {
   return new dgraph.DgraphClientStub( "localhost:9080" );
}

// Create a client.
function newClient( clientStub: dgraph.DgraphClientStub ): dgraph.DgraphClient {
   return new dgraph.DgraphClient( clientStub );
}

// Drop All - discard all data, schema and start from a clean slate.
async function dropAll( dgraphClient: dgraph.DgraphClient ) {
   const op = new dgraph.Operation();
   op.setDropAll( true );
   await dgraphClient.alter( op );
}

// Drop All Data, but keep the schema.
async function dropData( dgraphClient: dgraph.DgraphClient ) {
   const op = new dgraph.Operation();
   op.setDropOp( dgraph.Operation.DropOp.DATA );
   await dgraphClient.alter( op );
}

// Set schema.
async function setSchema( dgraphClient: dgraph.DgraphClient ) {
   const schema = `
       name: string @index(exact) .
       age: int .
       married: bool .
       loc: geo .
       dob: datetime .
       friend: [uid] @reverse .
       kake: string .
   `;

   const op = new dgraph.Operation();
   op.setSchema( schema );
   await dgraphClient.alter( op );

   const type = `
   type User {
      username: String! @id
      displayName: String
      avatarImg: String
      posts: [Post!]
      comments: [Comment!]
   }`;

   // const type = `
   // type User {
   //    username: String! @id
   //    displayName: String
   //    avatarImg: String
   //    posts: [Post!]
   //    comments: [Comment!]
   // }

   // type Post {
   //    id: ID!
   //    title: String! @search(by: [term])
   //    text: String! @search(by: [fulltext])
   //    tags: String @search(by: [term])
   //    datePublished: DateTime
   //    author: User!  @hasInverse(field: posts)
   //    category: Category! @hasInverse(field: posts)
   //    comments: [Comment!]
   // }

   // type Comment {
   //    id: ID!
   //    text: String!
   //    commentsOn: Post! @hasInverse(field: comments)
   //    author: User! @hasInverse(field: comments)
   // }

   // type Category {
   //    id: ID!
   //    name: String! @search(by: [term])
   //    posts: [Post!]
   // }`;

   const ip = new dgraph.Operation();
   ip.setSchema( type );
   await dgraphClient.alter( ip );
}

// Create data using JSON.
async function createData( dgraphClient: dgraph.DgraphClient ) {
   // Create a new transaction.
   const txn = dgraphClient.newTxn();
   try {
      // Create data.
      const p = {
         uid: "_:alice",
         name: "Alice",
         age: 26,
         married: true,
         loc: {
            type: "Point",
            coordinates: [ 1.1, 2 ],
         },
         dob: new Date( 1980, 1, 1, 23, 0, 0, 0 ),
         friend: [
            {
               name: "Bob",
               age: 24,
            },
            {
               name: "Charlie",
               age: 29,
            },
         ],
         school: [
            {
               name: "Crown Public School",
            },
         ],
      };

      // Run mutation.
      const mu = new dgraph.Mutation();
      mu.setSetJson( p );
      const response = await txn.mutate( mu );

      // Commit transaction.
      await txn.commit();

      // Get uid of the outermost object (person named "Alice").
      // Response#getUidsMap() returns a map from blank node names to uids.
      // For a json mutation, blank node label is used for the name of the created nodes.
      console.log(
         `Created person named "Alice" with uid = ${ response
            .getUidsMap()
            .get( "alice" ) }\n`,
      );

      console.log( "All created nodes (map from blank node names to uids):" );
      response
         .getUidsMap()
         .forEach( ( uid: any, key: any ) => console.log( `${ key } => ${ uid }` ) );
      console.log();
   } finally {
      // Clean up. Calling this after txn.commit() is a no-op
      // and hence safe.
      await txn.discard();
   }
}

// Query for data.
async function queryData( dgraphClient: dgraph.DgraphClient ) {
   // Run query.
   const query = `query all($a: string) {
       all(func: eq(name, $a)) {
           uid
           name
           age
           married
           loc
           dob
           friend {
               name
               age
           }
           school {
               name
           }
       }
   }`;
   const vars = { $a: "Alice" };
   const res = await dgraphClient
      .newTxn( { readOnly: true } )
      .queryWithVars( query, vars );
   const ppl = res.getJson();

   // Print results.
   console.log( `Number of people named "Alice": ${ ppl.all.length }` );
   ppl.all.forEach( ( person: any ) => console.log( person ) );
}