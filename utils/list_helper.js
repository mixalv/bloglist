const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const result = blogs.reduce((previousValue, curentValue) => previousValue+curentValue.likes,
   0)
   return result
}

const favoriteBlog = (blogs) => {
  const favBlog = blogs.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  })
  return( 
    {
      title: favBlog.title,
      author: favBlog.author,
      likes: favBlog.likes
    })
}

const mostBlogs = (blogs) => {
  blogsCounter = []
  blogs.forEach((blog) => {
    let findSameEl = blogsCounter.findIndex(el => el.author === blog.author)
    if (findSameEl === -1) {
      blogsCounter.push({
        author: blog.author,
        blogs: 1
      })
    } else {
        blogsCounter[findSameEl].blogs += 1
    }
  })
  const authorWithMostBlogs = blogsCounter.reduce((prev, current) => {
    return prev.blogs > current.blogs ? prev : current
  }, {})
  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  likesCounter = []
  blogs.forEach((blog) => {
    let findSameEl = likesCounter.findIndex(el => el.author === blog.author)
    if (findSameEl === -1) {
      likesCounter.push({
        author: blog.author,
        likes: blog.likes
      })
    } else {
        likesCounter[findSameEl].likes += blog.likes
    }
  })
  const authorWithMostLikes = likesCounter.reduce((prev, current) => {
    return prev.likes > current.likes ? prev : current
  }, {})
  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}