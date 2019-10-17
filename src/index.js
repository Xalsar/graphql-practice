import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'
import db from './db'

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, { db }, info) {
            if (!args.query) {
                return db.users
            }

            return db.users.filter((user) => {
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
        posts(parent, args, { db }, info) {
            if (!args.query) {
                return db.posts
            }

            return db.posts.filter((post) => post.title.toLowerCase().includes(args.query))
        },
        comments(parent, args, { db }, info) {
            return db.comments
        }
    },
    Mutation: {
        createUser(parent, args, { db }, info) {
            const emailTaken = db.users.some(user => user.email === args.data.email)

            if (emailTaken) {
                throw new Error('Email taken')
            }

            const user = {
                id: uuidv4(),
                ...args.data
            }

            db.users.push(user)

            return user
        },
        deleteUser(parent, args, { db }, info) {
            const userIndex = db.users.findIndex(user => user.id === args.id)

            if (userIndex === -1) {
                throw new Error("User does not exist")
            }

            const deletedUsers = db.users.splice(userIndex, 1)

            db.posts = db.posts.filter(post => {
                const match = post.id === args.id

                if (match) {
                    db.comments = db.comments.filter(comment => comment.post !== post.id)
                }

                return !match
            })

            db.comments = db.comments.filter(comment => comment.autho !== args.id)

            return deletedUsers[0]
        },
        createPost(parent, args, { db }, info) {
            const userExists = db.users.some(user => user.id === args.data.author)

            if (!userExists) {
                throw new Error('User does not exist')
            }

            const post = {
                id: uuidv4(),
                ...args.data
            }

            db.posts.push(post)

            return post
        },
        deletePost(parent, args, { db }, info) {
            const pos = db.posts.findIndex(post => post.id === args.id)

            if (pos === -1) {
                throw new Error('Post does not exist')
            }

            db.posts.splice(pos, 1)

            db.comments = db.comments.filter(comment => comment.post !== args.id)

            return db.posts[pos]
        },
        createComment(parent, args, { db }, info) {
            const userExists = db.users.some(user => user.id === args.data.author)
            const postExists = db.posts.some(post => post.id === args.data.post)

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

            db.comments.push(comment)

            return comment
        },
        deleteComment(parent, args, content, info) {
            const pos = db.comments.findIndex(comment => comment.id === args.id)

            db.comments.splice(pos, 1)

            return db.comments[pos]
        },
    },
    Post: {
        author(parent, args, { db }, info) {
            return db.users.find(user => user.id === parent.author)
        }
    },
    User: {
        posts(parent, args, { db }, info) {
            return db.posts.filter(post => post.author === parent.id)
        },
        comments(parent, args, { db }, info) {
            return db.comments.filter(comment => comment.author === parent.id)
        }
    },
    Comment: {
        author(parent, args, { db }, info) {
            return db.users.find(user => user.id === parent.author)
        },
        post(parent, args, { db }, info) {
            return db.posts.find(post => post.id === parent.post)
        }
    }
}


const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})

server.start(() => console.log('The server is up!'))
