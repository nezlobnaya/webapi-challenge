//Libraries
const express = require('express')

//local files
const Projects = require('../data/helpers/projectModel')
const Actions = require('../data/helpers/actionModel')

//establish Router
const router = express.Router()

//CRUD ops
router.get('/', async (req, res, next) => {
    try {
        const projects = await Projects.get()
        res.json(projects)
    } catch (err) {
        next(err)
    }
})

router.get('/:id', validateProjectId, async (req, res, next) => {
    try {
        res.json(await Projects.get(req.params.id))
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions', validateProjectId, async (req, res) => {
    try {
        const actions = await Projects.getProjectActions(req.params.id)
        res.json(actions)
    } catch (err) {
        next(err)
    }
})

router.post('/', validateProjectBody, async (req, res, next) => {
    try {
      const payload = {
        name: req.body.name,
        description:req.body.description,
      }
      const project = await Projects.insert(payload)
      res.status(201).json(project)
    } catch(err) {
      next(err)
    }
}); 

router.post('/:id/actions', validateProjectId, validateAction,  async (req, res, next) => {
    try {
      const payload = {
        description: req.body.description,
        notes: req.body.notes,
        project_id: req.params.id
      }
      const action = await Actions.insert(payload)
        res.status(201).json(action)
    } catch(err) {
        console.log(err)
       next(err)
    }
  })

  router.delete('/:id',validateProjectId, async (req, res) => {
    try {
      const count = await Projects.remove(req.params.id)
        if (count > 0) {
          res.status(200).json({ message: 'The project has been nuked' });
        } else {
          res.status(404).json({ message: 'The project could not be found' });
        }
      } catch(error) {
        console.log(error);
        res.status(500).json({
          message: 'Error removing the project',
        })
      }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const payload = {
        name: req.body.name,
        description: req.body.description,
      }
  
      await Projects.update(req.params.id, payload)
      res.json(await Projects.get(req.params.id))
    } catch(err) {
        next(err)
      }
  });

  async function validateProjectId(req, res, next) {
    try {
      const project = await Projects.get(req.params.id)
    
      if (project) {
            req.project = project
            next()
          } else {
            res.status(404).json({
              message: 'Project not found'
            }) 
          }
        } catch(err) {
              console.log(err)
          next(err)
        }
      }

function validateProjectBody(req, res, next) {
    if (!req.body.name || !req.body.description ) {
    res.status(400).json({
        message: 'Missing project content'
    })
    } else {
    next()
  }
} 

function validateAction(req, res, next) {
    if (!req.body.description || !req.body.notes) {
        return res.status(400).json({
            message: "Missing action content"
        })
    } else {
        next()
    }
}

module.exports = router