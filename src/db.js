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

const db = {
    users,
    posts,
    comments
}

export { db as default}