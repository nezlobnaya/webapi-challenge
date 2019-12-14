const express = require('express')
const Actions = require('../data/helpers/actionModel')

const router = express.Router({
    mergeParams: true
})

router.get('/', async (req, res, next) => {
    try {
        const actions = await Actions.get()
        res.json(actions)
    } catch (err) {
        next(err)
    }
})

router.get('/:id',validateActionId, async (req, res, next) => {
    try {
        res.json(await Actions.get(req.params.id))
    } catch(err) {
        next(err)
    }
})

router.delete('/:id',validateActionId, async (req, res, next) => {
    try {
        await Actions.remove(req.params.id)
        res.json({
            message: 'The action has been deleted'
        })
    } catch(err) {
        next(err)
    }
})

router.put('/:id',validateAction, validateActionId, async (req, res, next) => {
    try {
        const payload = {
            description: req.body.description,
            notes: req.body.notes,
        }
    await Actions.update(req.params.id, payload)
    res.json(await Actions.get(req.params.id))
    } catch (err) {
        next(err)
    }
})

async function validateActionId(req, res, next) {
  try {
    const action = await Actions.get(req.params.id)
  
    if (action) {
      req.action = action
      next()
    } else {
      res.status(404).json({
        message: 'Action not found'
      })
    }
  } catch(err) {
    console.log(err)
    next(err)
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