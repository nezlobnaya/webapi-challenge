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

router.get('/:id', async (req, res, next) => {
    try {
        res.json(await Actions.get(req.params.id))
    } catch(err) {
        next(err)
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        await Actions.remove(req.params.id)
        res.json({
            message: 'The action has been deleted'
        })
    } catch(err) {
        next(err)
    }
})

router.put('/:id', async (req, res, next) => {
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

module.exports = router