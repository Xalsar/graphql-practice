import { GraphQLServer } from 'graphql-yoga'

// Type definitions (schema)
const typeDefs = `
    type Query {
        greeting(name: String, position: String): String!
        me: User!
        post: Post!
        add(n1: Float, n2: Float): Float!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`

// Resolvers
const resolvers = {
    Query: {
        greeting(parent, args, ctx, info) {
            if (args.name && args.position) {
                return `Hello ${args.name} you are my favourite ${args.position}!`
            } else {
                return `Hello!`
            }
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@gmail.com',
                age: 28
            }
        },
        post() {
            return {
                id: '123098',
                title: 'How to get your driving license?',
                body: 'Lorem dolor ipsum sit amen',
                published: false
            }
        },
        add(undefined, args) {
            if (args.n1 && args.n2) {
                return args.n1 + args.n2
            } else {
                return 3.0
            }
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => console.log('The server is up!'))
