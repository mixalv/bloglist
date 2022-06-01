const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)   
})

blogsRouter.post('/', async (request, response) => {
  const user = request.user
  const blog = new Blog({...request.body, user: user._id})
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return  response.status(404).json({
      "error": "no such blog"
    })
  }
  if ( blog.user.toString() === user._id.toString() ) {
    await blog.deleteOne()
    return response.status(204).end()
  }
  response.status(401).json({
    "error": "this is not your blog"
  })
  
})

blogsRouter.put('/:id', async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  if ( blog.user.toString() === user._id.toString() ) {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body, {new: true})
    return response.json(updatedBlog)
  }
  response.status(401).json({
    "error": "this is not your blog"
  })

})

module.exports = blogsRouter