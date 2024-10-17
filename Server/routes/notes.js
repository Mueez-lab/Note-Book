const express = require('express')
const router = express.Router();
const Notes = require('../model/Notes');
const fetchusers = require('../middleware/fetchUser')
const { body, validationResult } = require("express-validator");

//it will fetch all the notes of the user from the database
router.get('/',fetchusers,async(req,res)=>{
    const notes = await Notes.find({user:req.user.id} )
    res.json(notes)
})

// Adding data in the notes 

router.post('/createNotes',fetchusers,[
    body("title").isLength({min:3}).withMessage("Enter a valid title"),
    body('description').isLength({min: 3}).withMessage("Description must be 5 char")
],async(req,res)=>{
    try {
        const {title,description,tag}=req.body
        const errors = validationResult(req); //validationResult(req) function is part of the express-validator library. It is used to gather the validation errors that occurred while processing the request.

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({  // create a table called note
            title,description,tag,user:req.user.id
        })
        const savedNote= await note.save()
        res.json(savedNote)
    } catch (error) {
        console.log(error);
        res.status(500).send("Error !")
    }
})

//Upadte a note
router.put('/updatenotes/:id',fetchusers,async (req,res)=>{
    const {title,description,tag} = req.body;
    const newNotes = {};
    if(title){newNotes.title = title};
    if(description){newNotes.description = description};
    if(tag){newNotes.tag = tag};

    try {
        let note = await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("Note Found");
        }
        if(note.user.toString()!== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNotes}, {new: true});
        res.json(newNotes)
    } catch (error) {
        res.send(500).send("Error")
        console.log(error);
    }
})

// Delete Notes 

router.delete('/deletenote/:id',fetchusers,async(req,res)=>{
    try {
        let note = await Notes.findById(req.params.id);
        if(!note)
        {
            return res.status(404).send("Note Found");
        }
        if(note.user.toString()!== req.user.id ){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id,{new: true})
        res.send("Deleted Successfully")
}
catch (error) {
    res.send(500).send("Error")
    console.log(error);
}

})

module.exports = router;