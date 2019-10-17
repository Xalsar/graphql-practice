import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

// Demo user data
let users = [
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

let posts = [
    {
        id: '1',
        title: 'Why I love the last question?',
        body: 'Lorem dolor sit amen',
        published: true,
        author: '1'
    },
    {
        id: '2',
        title: 'Why I dislike university?',
        body: 'Lorem dolor sit amen',
        published: true,
        author: '1'
    },
    {
        id: '3',
        title: 'Why you should learn CRSPR',
        body: 'Lorem dolor sit amen',
        published: false,
        author: '2'
    }
]

let comments = [
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
        post: '3'
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
        post: '1'
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

    type Mutation {
        createUser(data: CreateUserInput): User!
        deleteUser(id: ID): User!
        createPost(data: CreatePostInput): Post!
        deletePost(id: ID): Post!
        createComment(data: CreateCommentInput): Comment!
        deleteComment(id: ID): Comment!
    }

    input CreateUserInput {
        name: String!
        email: String!
        age: Int
    }

    input CreatePostInput {
        title: String!
        body: String!
        published: Boolean!
        author: ID!
    }

    input CreateCommentInput {
        text: String!
        author: ID!
        post: ID!
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
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some(user => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            users.push(user)

            return user
        },
        deleteUser(parent, args, ctx, info) {
            const userIndex = users.findIndex(user => user.id === args.id)

            if (userIndex === -1) {
                throw new Error("User does not exist")
            }

            const deletedUsers = users.splice(userIndex, 1)

            posts = posts.filter(post => {
                const match = post.id === args.id

                if (match) {
                    comments = comments.filter(comment => comment.post !== post.id)
                }

                return !match
            })

            comments = comments.filter(comment => comment.autho !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, contect, info) {
            const userExists = users.some(user => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User does not exist')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            posts.push(post)

            return post
        },
        deletePost(parent, args, content, info) {
            const pos = posts.findIndex(post => post.id === args.id)

            if (pos === -1) {
                throw new Error('Post does not exist')
            }

            posts.splice(pos, 1)

            comments = comments.filter(comment => comment.post !== args.id)

            return posts[pos]
        },
        createComment(parent, args, ctx, info) {
            const userExists = users.some(user => user.id === args.data.author)
            const postExists = posts.some(post => post.id === args.data.post)

            if (!userExists) {
                throw new Error('User does not exist')
            }

            if (!postExists) {
                throw new Error('Post does not exist')
            }

            const comment = {
                id: uuidv4(),
                ...args.data
            }

            comments.push(comment)

            return comment
        },
        deleteComment(parent, args, content, info) {
            const pos = comments.findIndex(comment => comment.id === args.id)

            comments.splice(pos, 1)

            return comments[pos]
        },
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
            return posts.find(post => post.id === parent.post)
        }
    }
}


const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => console.log('The server is up!'))
