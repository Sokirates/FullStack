const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
  { title: 'React patterns', author: 'Michael Chan', url: 'https://reactpatterns.com/', likes: 7 },
  { title: 'Go To Statement Considered Harmful', author: 'Edsger W. Dijkstra', url: 'http://www.u.arizona.edu/~rubinson/', likes: 5 },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

// 4.8
describe('when there are initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
})

// 4.9
test('blogs have id field instead of _id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id)
  assert(!blog._id)
})

// 4.10
describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const titles = response.body.map(b => b.title)
    assert(titles.includes('Type wars'))
  })

  // 4.11
  test('likes defaults to 0 if missing', async () => {
    const newBlog = {
      title: 'No likes blog',
      author: 'Test Author',
      url: 'http://test.com',
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  // 4.12
  test('blog without title returns 400', async () => {
    const newBlog = { author: 'Test', url: 'http://test.com', likes: 0 }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })

  test('blog without url returns 400', async () => {
    const newBlog = { title: 'Test', author: 'Test', likes: 0 }
    await api.post('/api/blogs').send(newBlog).expect(400)
  })
})

// 4.13
describe('deletion of a blog', () => {
  test('succeeds with status 204 if id is valid', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    assert.strictEqual(blogsAtEnd.body.length, initialBlogs.length - 1)
  })
})

// 4.14
describe('updating a blog', () => {
  test('likes can be updated', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
