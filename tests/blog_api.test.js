const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const jwt = require('jsonwebtoken')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


testHelper = require('./test_helper')

describe('test suit', ()=>{
  let initialBlogs = testHelper.listWithManyBlogs
  let initialUser = testHelper.initialUser('1234', 10)
  let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  let userObject = new User(await initialUser)
  const savedUser = await userObject.save()
  for(let blog of initialBlogs) {
    let blogObject = new Blog({...blog, user: savedUser._id})
    await blogObject.save()
  }
  token = jwt.sign({username: savedUser.username, id: savedUser._id}, process.env.SECRET, { expiresIn: 60*60 })
})

test('check the quantity of the blogs', async () => {
  const response = await api
    .get('/api/blogs')
    .set('Authorization', `bearer ${token}`)
  expect(response.body).toHaveLength(initialBlogs.length)
})

test('id property exists', async () => {
  const blogs = await api
    .get('/api/blogs')
    .set('Authorization', `bearer ${token}`)
  expect(blogs.body[0].id).toBeDefined()
})

test('new blog creates', async() => {
  await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token}`)
          .send(testHelper.newBlog)
  const blogsAtEnd = await testHelper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(initialBlogs.length+1)
})

test('default likes 0', async() => {
  const createdBlog = await api
          .post('/api/blogs')
          .set('Authorization', `bearer ${token}`)
          .send(testHelper.blogWithoutLikes)
  expect(createdBlog.body.likes).toBe(0)
})

test('400 after creating blog without title', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testHelper.blogWithoutTitle)
    .expect(400)
})

test('400 after creating blog without url', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${token}`)
    .send(testHelper.blogWithoutUrl)
    .expect(400)
})

test('deleting of the blog', async () => {
  const id = initialBlogs[0]._id
  await api
          .delete(`/api/blogs/${id}`)
          .set('Authorization', `bearer ${token}`)
  const endState = await testHelper.blogsInDb()
  expect(endState).toHaveLength(initialBlogs.length-1)
})

test('update likes', async () => {
  const id = initialBlogs[0]._id
  const updatedBlog = await api
    .put(`/api/blogs/${id}`)
    .set('Authorization', `bearer ${token}`)
    .send({
      ...initialBlogs[0],
      likes: initialBlogs[0].likes+1
    })
    const endState = await testHelper.blogsInDb()
    expect(endState[0].likes).toBe(initialBlogs[0].likes+1)

})

test('authorizatio error', async() => {
  await api
          .post('/api/blogs')
          .send(testHelper.newBlog)
          .expect(401)
})


afterAll(() => {
  mongoose.connection.close()
})
})

