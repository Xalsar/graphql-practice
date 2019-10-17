import { GraphQLServer } from 'graphql-yoga'
import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import db from './db'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'

// Resolvers
const resolvers = {
    Query,
    Mutation,
    Post,
    User,
    Comment
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => console.log('The server is up!'))
