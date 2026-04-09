// 4.3
const dummy = (blogs) => {
  return 1
}

// 4.4
const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

// 4.5
const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  const favorite = blogs.reduce((max, blog) =>
    blog.likes > max.likes ? blog : max
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

// 4.6
const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const counts = {}
  blogs.forEach(blog => {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  })

  const topAuthor = Object.keys(counts).reduce((a, b) =>
    counts[a] > counts[b] ? a : b
  )

  return { author: topAuthor, blogs: counts[topAuthor] }
}

// 4.7
const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likes = {}
  blogs.forEach(blog => {
    likes[blog.author] = (likes[blog.author] || 0) + blog.likes
  })

  const topAuthor = Object.keys(likes).reduce((a, b) =>
    likes[a] > likes[b] ? a : b
  )

  return { author: topAuthor, likes: likes[topAuthor] }
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
