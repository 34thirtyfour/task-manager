const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();


router.post('/tasks',auth, async(req,res) => {
    //const task =  new Task(req.body);
    const task =  new Task({
        ...req.body,
        owner:req.user._id
    })
    try{
        //const task = await task.save();
        await task.save();
        res.send(task);
    }catch(e){
        res.send(e);
    }
    
})

router.get('/tasks', auth, async(req,res) => {
    const match = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    try{
        //const tasks = await Task.find({});
        await req.user.populate({
            path:'tasks',
            match
        }).execPopulate();
        res.send(req.user.tasks);
    }catch(e){
        res.send(e);
    }
})

router.get('/tasks/:id', auth, async(req, res) => {
    const _id = req.params.id;
    try{
        //const task = await Task.findById(_id);
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return new Erro('No Task Found');
        }
        res.send(task);
    }catch(e){
        res.send(e);
    }
})

router.patch('/tasks/:id', auth, async(req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description','completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation){
        return res.send('not valid');
    }
    try{
        const task = await Task.findOne({_id:req.params.id, owner:req.user._id});
        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();

        res.send(task);
    }catch(e){
        res.send(e);
    }

})

router.delete('/tasks/:id',auth, async(req,res) => {
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id});
        if(!task){
             res.send('No task found');
        }
        res.send(task);
    }catch(e){
        res.send(e);
    }
})
module.exports = router