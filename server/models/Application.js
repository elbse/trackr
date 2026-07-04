import mongoose from 'mongoose'

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
      default: '—',
    },
    status: {
      type: String,
      enum: ['applied', 'interview', 'pending', 'offer', 'rejected'],
      default: 'applied',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
)

const Application = mongoose.model('Application', applicationSchema)

export default Application