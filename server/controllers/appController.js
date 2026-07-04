import Application from '../models/Application.js'

// GET /api/applications — get all applications for logged in user
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id }).sort({
      createdAt: -1,
    })
    res.json(applications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/applications — create a new application
export const createApplication = async (req, res) => {
  const { company, role, position, status, date, notes } = req.body

  try {
    const application = await Application.create({
      user: req.user._id,
      company,
      role,
      position,
      status,
      date,
      notes,
    })
    res.status(201).json(application)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/applications/:id — update an application
export const updateApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/applications/:id — delete an application
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: 'Application not found' })
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await application.deleteOne()

    res.json({ message: 'Application removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}