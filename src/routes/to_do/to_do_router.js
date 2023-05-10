const express = require('express');
const router = express.Router();
const queryUtils = require('../../utils/queries_util');
const utils = require('../../utils/utils.js');
const auth_apikey = require('../../middleware/auth_api_key')
const { query } = require('../../database.js');

router.get('', [auth_apikey], async(req, res) => {
    const { currentPage, itemsPerPage, status, task_name } = req.query
    var params = status ? {status: `${status}`}: null

    var response = await utils.paginated_query(queryUtils.get_chores_to_do, params, itemsPerPage, currentPage)
    res.send(response)
})
router.post('', [auth_apikey], async(req, res) => {
    const {task_name} = req.body
    const bodyTosave = {task_name:`${task_name}`, task_id: `${utils.UUID()}`}
    try {
        var response = await query(queryUtils.save_chores_to_do, bodyTosave)
        if(utils.query_respose_to_json(response).insertId){
            res.status(201).send({ message: `task created successfully`})
        }
    } catch (error) {
        res.status(400).send(error)
    }
})
router.put('', [auth_apikey], async(req, res) => {

})


module.exports = router