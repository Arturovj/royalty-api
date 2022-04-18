const mongoose = require('mongoose')


const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    description: {
      type: String,
      required: [true, 'description is required']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    image: {
      type: String,
      required: [true, 'image is required']
    },
    genre: {
        type: String,
        required: [true, 'genre is required']
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.__v
        return ret
      }
    }
  }
)



const Post = mongoose.model('Post', postSchema)

module.exports = Post