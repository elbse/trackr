import express from 'express'
import {
  getApplications,
  createApplication,
  updateApplication,
  deleteApplication,
} from '../controllers/appController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.route('/').get(protect, getApplications).post(protect, createApplication)

router
  .route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication)

export default router