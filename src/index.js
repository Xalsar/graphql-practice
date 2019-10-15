import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const users = [
    {
        id: '1',
        name: 'Andrew',
        email: 'andrewmead@example.com',
        age: 27
    },
    {
        id: '2',
        name: 'Sarah',
        email: 'sarah@example.com',
    },
    {
        id: '3',
        name: 'Mike',
        email: 'mike@example.com',
    }
]

const posts = [
    {
        id: '1',
        title: 'Why I love the last question?',
        body: 'Lorem dolor sit amen',
        publushed: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Why I dislike university?',
        body: 'Lorem dolor sit amen',
        publushed: true,
        author: '1'
    },
    {
        id: '3',
        title: 'Why you should learn CRSPR',
        body: 'Lorem dolor sit amen',
        publushed: false,
        author: '2'
    }
]

const comments = [
    {
        id: '1',
        text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        author: '1',
        post: '1'
    },
    {
        id: '2',
        text: 'Curabitur et diam vitae dui egestas pharetra.',
        author: '1',
        post: '2'
    },
    {
        id: '3',
        text: 'Suspendisse magna lectus, dictum id fermentum id, vulputate ac dui.',
        author: '2',
        post: '2'
    },
    {
        id: '4',
        text: 'Suspendisse magna lectus, dictum id fermentum id, vulputate ac dui.',
        author: '3',
        post: '3'
    }
]


// Type definitions (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        me: User!
        posts(query: String): [Post!]!
        comments: [Comment!]!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            if (!args.query) {
                return users
            }

            return users.filter((user) => {
                return user.name.toLowerCase().includes(args.query.toLowerCase())
            })
        },
        me() {
            return {
                id: '123098',
                name: 'Mike',
                email: 'mike@gmail.com',
                age: 28
            }
        },
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts
            }

            return posts.filter((post) => post.title.toLowerCase().includes(args.query))
        },
        comments() {
            return comments
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, ctx, info) {
            return comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find(user => user.id === parent.author)
        },
        post(parent, args, ctx, info) {
            return posts.find(post => post.id === parent.author)
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => console.log('The server is up!'))
