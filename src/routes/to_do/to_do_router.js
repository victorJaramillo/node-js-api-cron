const express = require('express');
const router = express.Router();
const queryUtils = require('../../utils/queries_util');
const utils = require('../../utils/utils.js');
const auth_apikey = require('../../middleware/auth_api_key')
const { query } = require('../../database.js');

router.get('/tasks', [auth_apikey], async (req, res) => {
    const { currentPage, itemsPerPage, status } = req.query

    var query = queryUtils.get_chores_to_do
    if (status && status != 2) {
        query = `${query} WHERE ctd.status= ${status} `
    }

    var response = await utils.paginated_query(query, itemsPerPage, currentPage)
    res.send(response)
})
router.post('/tasks', [auth_apikey], async (req, res) => {
    const { task_name } = req.body
    if (task_name == undefined) {
        message = { error: 400, message: "body params is required" }
        res.status(400).send(message)
    } else {
        const bodyTosave = { task_name: `${task_name}`, task_id: `${utils.UUID()}` }
        try {
            var response = await query(queryUtils.save_chores_to_do, bodyTosave)
            if (utils.query_respose_to_json(response).insertId) {
                res.status(201).send({ message: `task created successfully` })
            }
        } catch (error) {
            res.status(400).send(error)
        }
    }
})
router.put('/tasks/:id', [auth_apikey], async (req, res) => {
    const { id } = req.params
    const { status } = req.body
    if (status == undefined) {
        message = { error: 400, message: "body params is required" }
        res.status(400).send(message)
    } else {
        try {
            const { affectedRows } = await query(queryUtils.update_chores_to_do(id), { status: status })
            if (affectedRows === 1) {
                res.send({ message: `task updated successfully` })
            }
        } catch (error) {
            res.status(400).send(JSON.parse(error))
        }
    }
})


module.exports = router