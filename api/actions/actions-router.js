const express = require('express');
const actions = require('./actions-model.js');

//middleware
//const { validateActionId, validateAction } = require('../middleware.js');

const router = express.Router();

// - [x] `[GET] /api/actions`
//   - Returns an array of actions (or an empty array) as the body of the response.
router.get('/api/actions', (req, res) => {
    actions.get()
        .then((actionsArray) => {
            if(!actionsArray){
                res.status(404).json([])
            } else {
                res.status(200).json(actionsArray)
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: 'Error recieving actions data'});
        });
})
///6/22/2021 - recomplete - was missing the returning of an empty array if there wasn't any; needed if/else statement


// - [x] `[GET] /api/actions/:id`
//   - Returns an action with the given `id` as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
router.get('/api/actions/:id', /*validateActionId,*/ (req, res) => {
    actions.get(req.params.id)
        .then((actionsId) => {
            if(!actionsId) {
                res.status(404).json({message:` Action with this id: ${req.params.id} could not be retrieved`})
            } else {
                res.status(200).json(actionsId)
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: 'Error finding specific action id'});
        });
});
////6/22/2021 - recomplete - was missing the error return message if there wasn't id; needed if/else statement


// - [x] `[POST] /api/actions`
//   - Returns the newly created action as the body of the response.
//   - If the request body is missing any of the required fields it responds with a status code 400.
//   - When adding an action make sure the `project_id` provided belongs to an existing `project`.
router.post('/api/actions', /*validateAction,*/ (req, res) => {
    const body = req.body;
    if(!body || !body.project_id || !body.description || !body.notes) {
        res.status(400).json({message: 'All fields are required'})
    } else {
     actions.insert(req.body)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: 'Could not update action details'})
        })
    }
});
////6/22/2021 - re-complete without the middleware validateAction, instead included the if/else statement that checked for all required fields.


// - [x] `[PUT] /api/actions/:id`
//   - Returns the updated action as the body of the response.
//   - If there is no action with the given `id` it responds with a status code 404.
//   - If the request body is missing any of the required fields it responds with a status code 400.
router.put('/api/actions/:id', /* validateActionId, validateAction,*/ (req, res) => {
    const id = req.params.id;
    const changes = req.body;

    if(!changes){
        res.status(400).json({message: 'All fields are required'})
    } else {

        actions.update(id, changes)
        .then((updatedAction) => {
            if(!updatedAction) {
                res.status(404).json({message: `Action id : ${id} not found`})
            } else {
                res.status(200).json(updatedAction);
            }
            
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({message: 'Could not update action id'})
        })
    }
    
});
///6/22/2021- re complete: removed any middleware validation and put within the router. 


// - [x] `[DELETE] /api/actions/:id`
//   - Returns no response body.
//   - If there is no action with the given `id` it responds with a status code 404.
router.delete('/api/actions/:id', /*validateActionId,*/ (req, res) => {
    const id = req.params.id;
    
    actions.get(id)
        .then((actionId) => {
            if(actionId) {

                actions.remove(id)   //once you find the action that you want to delete
                    .then((deleteId) => {
                        res.status(200).json({message: `Successfully deleted id ${id}`})
                    })
                    .catch(error => {
                        console.log(error)
                        res.status(400).json({message: 'Error removing this action'});
                    });
            } else {
                res.status(404).json({message: `Error finding action id ${id}`})
            }
        })
    
        .catch((error) => {
            console.log("error", error)
            res.status(500).json({ message: `Error, the action of id ${id} could not be deleted`})
        })
});

////6/22/2021 - Added in the validation for id, nesting the remove method inside.





 
module.exports = router;


/////////Notes: What I'm not understanding is why we did not abstract out the validation functions into the middleware, making these router endpoints cleaner
///////// *How I rewrote the endpoints in the actions-router, I would do the same for the projects-router; removing the middleware entirely.