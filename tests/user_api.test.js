const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')


testHelper = require('./test_helper')

let initialUser = {
	"name": "Mike",
	"passwordHash": "1234",
	"username": "Moko"
}

beforeEach(async () => {
  await User.deleteMany({})
  let userObject = new User(initialUser)
  await userObject.save()
})

test('check creation with same username', async () => {
  const initialState = await testHelper.usersInDb()
  const result =  await api
    .post('/api/users')
    .send({...initialUser,
      password: '1234'
    })
    .expect(400)
  expect(result.body.error).toContain('username must be unique')
  const actualState = await testHelper.usersInDb()
  expect(initialState).toEqual(actualState)
})

test('check creation with password less than 3 char', async () => {
  const initialState = await testHelper.usersInDb()
  const result =  await api
    .post('/api/users')
    .send({
      name: 'm',
      password: '12',
      username: 'Moka'
    })
    .expect(400)
  expect(result.body.error).toContain('password must be at least 3 characters long')
  const actualState = await testHelper.usersInDb()
  expect(initialState).toEqual(actualState)
})

test('check creation with username less than 3 char', async () => {
  const initialState = await testHelper.usersInDb()
  const result =  await api
    .post('/api/users')
    .send({
      name: 'm',
      password: '1234',
      username: 'Mo'
    })
    .expect(400)
  expect(result.body.error).toContain('User validation failed: username: Path `username` (`Mo`) is shorter than the minimum allowed length (3).')
  const actualState = await testHelper.usersInDb()
  expect(initialState).toEqual(actualState)
})

test('check creation without username', async () => {
  const initialState = await testHelper.usersInDb()
  const result =  await api
    .post('/api/users')
    .send({
      name: 'm',
      password: '1234'
    })
    .expect(400)
  expect(result.body.error).toContain('User validation failed: username: Path `username` is required.')
  const actualState = await testHelper.usersInDb()
  expect(initialState).toEqual(actualState)
})

test('check creation without password', async () => {
  const initialState = await testHelper.usersInDb()
  const result =  await api
    .post('/api/users')
    .send({
      name: 'm',
      username: '1234'
    })
    .expect(400)
  expect(result.body.error).toContain('password must be provided')
  const actualState = await testHelper.usersInDb()
  expect(initialState).toEqual(actualState)
})




afterAll(() => {
  mongoose.connection.close()
})