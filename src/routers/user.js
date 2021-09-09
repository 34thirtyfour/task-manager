const express = require('express');
const multer = require('multer');
const User = require('../models/users');
const auth = require('../middleware/auth');
const { sendWelcomeMail} = require('../emails/account');
const router = new express.Router();

router.post('/users', async(req,res) => {
    const user =  new User(req.body);
    try{
        await user.save();
        sendWelcomeMail(user.email,user.name);
        const token = await user.generateAuthToken();
        res.send(user);
    }catch(e){
        res.send(e);
    }
    
})

router.post('/users/login', async(req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    }catch(e){
        res.send(e);
    }
})

router.post('/users/logout', auth, async(req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        })
        await req.user.save();
        res.send('User Logout');
    }catch(e){
        res.send(e);
    }
})

router.post('/users/logoutAll', auth, async(req, res) =>{
    try{
        req.user.tokens = [];
        req.user.save();
        res.send('User Logout from all devices');
    }catch(e){
        res.send(e);
    }
})

router.get('/users/me', auth,  async(req,res) => {
    res.send(req.user);
})

router.get('/users/:id',async(req,res) => {
    const _id = req.params.id;
    try{
        const user = await User.findById(_id);
        if(!user){
            return res.send('User not found');
        }
        res.send(user);
    }catch(e){
        res.send(e);
    }
    
    
})

router.patch('/users/:id', async (req,res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','age','address','email','password'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if(!isValidOperation){
        return res.send('Error in updates');
    }
    try{
        const user = await User.findById(req.params.id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new:true , runValidators: true});
        if(!user){
            return res.send('User Not updated');
        }
        res.send(user);
    }catch(e){
        return res.send(e);
    }
})

/*router.delete('/users/:id', async (req,res) =>{
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.send('User not found');
        }
        res.send(user);
    }catch(e){
        return res.send(e);
    }
})*/

// Delete Own account only because of authentication

router.delete('/users/me', auth, async(req,res)=>{
    try{
        await req.user.remove();
        res.send(req.user);
    }catch(e){
        res.send(e);
    }
})

const upload = multer({
    dest:'avatars'
})

router.post('/users/me/avatars', upload.single('avatar'), (req,res) =>{
    res.send();
})
module.exports = router