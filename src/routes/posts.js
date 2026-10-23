import { Router } from 'express'
import mongoose from 'mongoose'
import Post from '../models/Post.js'

const router = Router()

function serializePost (post) {
  return {
    id: post._id.toString(),
    author: post.author,
    text: post.text,
    imageUrl: post.imageUrl,
    likesCount: post.likes.length,
    liked: post.likes.includes('demo-user'),
    createdAt: post.createdAt
  }
}

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1)
    const limit = Math.min(
      30,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 10)
    )

    const posts = await Post.find()
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()

    res.json({
      posts: posts.map(serializePost),
      page,
      hasMore: posts.length === limit
    })
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const text = typeof req.body.text === 'string' ? req.body.text.trim() : ''
    const imageUrl =
      typeof req.body.imageUrl === 'string' ? req.body.imageUrl.trim() : ''

    if (!text || text.length > 2000) {
      return res.status(400).json({
        message: 'Post text must contain 1–2000 characters.'
      })
    }

    if (imageUrl) {
      try {
        const url = new URL(imageUrl)
        if (url.protocol !== 'https:') throw new Error('HTTPS required')
      } catch {
        return res.status(400).json({
          message: 'Image URL must be a valid HTTPS URL.'
        })
      }
    }

    const post = await Post.create({
      author: {
        name: 'Alex Morgan',
        handle: 'alexmorgan',
        avatar: ''
      },
      text,
      imageUrl,
      likes: []
    })

    res.status(201).json({ post: serializePost(post) })
  } catch (error) {
    next(error)
  }
})

router.post('/:id/like', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid post ID.' })
    }

    // Demo-only identity. Replace with req.user.id after authentication.
    const userId = 'demo-user'
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found.' })
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id !== userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    res.json({ post: serializePost(post) })
  } catch (error) {
    next(error)
  }
})

export default router
