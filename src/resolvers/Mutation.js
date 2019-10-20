import uuidv4 from 'uuid/v4'
import { PubSub } from 'graphql-yoga'

const Mutation = {
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
    updateUser(parent, args, { db }, info) {
        const { id, data } = args
        const user = db.users.find(user => user.id === args.id)

        if (!user) {
            throw new Error('User not found')
        }

        if (typeof data.email === 'string') {
            const emailTaken = db.users.some(user => user.email === data.email)

            if (emailTaken) {
                throw new Error('Email already taken')
            }

            user.email = data.email
        }

        if (typeof data.name === 'string') {
            user.name = data.name
        }

        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }

        return user
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExists = db.users.some(user => user.id === args.data.author)

        if (!userExists) {
            throw new Error('User does not exist')
        }

        const post = {
            id: uuidv4(),
            ...args.data
        }

        db.posts.push(post)

        if (post.published === true) {
            pubsub.publish('WATCH_POST', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const pos = db.posts.findIndex(post => post.id === args.id)

        if (pos === -1) {
            throw new Error('Post does not exist')
        }

        const [delpost] = db.posts.splice(pos, 1)

        db.comments = db.comments.filter(comment => comment.post !== args.id)

        if(delpost.published ) {
            pubsub.publish('WATCH_POST', {
                post: {
                    mutation: 'DELETED',
                    data: delpost
                }
            })
        }

        return delpost
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find(post => post.id === id)
        const originalPost = { ...post }

        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === "string") {
            post.title = data.title
        }

        if (typeof data.body === "string") {
            post.body = data.body
        }

        if (typeof data.published === "boolean") {
            post.published = data.published

            if(originalPost.published && !post.published) {
                pubsub.publish('WATCH_POST', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if(!originalPost.published && post.published) {
                pubsub.publish('WATCH_POST', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            }
        } else if(post.published) {
            pubsub.publish('WATCH_POST', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    createComment(parent, args, { db, pubsub }, info) {
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
        pubsub.publish(`comment ${args.data.post}`, { comment })

        return comment
    },
    deleteComment(parent, args, content, info) {
        const pos = db.comments.findIndex(comment => comment.id === args.id)

        db.comments.splice(pos, 1)

        return db.comments[pos]
    },
    updateComment(parent, args, { db }, info) {
        const { id, data } = args
        const comment = db.comments.find(comment => comment.id === args.id)

        if (!comment) {
            throw new Error("Comment not found")
        }

        if (typeof data.text === "string") {
            comment.text = data.text
        }

        return comment
    }
}

export { Mutation as default }

