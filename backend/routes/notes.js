const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

//Route:1 Get all the notes using: get "/api/notes/getuser".login required

router.get('/fetchallnotes', fetchuser, async (req, res)=>{
    try {
    const notes = await Note.find({user: req.user.id});
    res.json(notes)        
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");       
}
})

//Route:2 Add a new notes using: post "/api/notes/addnote".login required

router.post('/addnote',fetchuser, [
    body('title','enter valid title').isLength({ min: 3 }),
    body('description','description atleast 5 charater').isLength({min: 5}),
] , async (req, res)=>{
        //if there are errors, return bad request and the errors
    try {
    const {title, description, tag} = req.body;
    const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
   }
   const note = new Note({
    title, description, tag, user: req.user.id
   })
   const saveNote = await note.save()

    res.json(saveNote)

} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");       
}
})

//Route:3 Update an existing notes using: post "/api/notes/updatenote".login required
router.put('/updatenote/:id', fetchuser, async (req,res) =>{
    const {title, description, tag } = req.body;
    try {      
    //create a newNote object
    const newNote = {};
    if(title){newNote.title = title};
    if(description){newNote.description = description};
    if(tag){newNote.tag = tag};

    //Find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote},{new:true})
}catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");
        
}
    res.json({note});
})

//Route:4 Delete an existing notes using: delete "/api/notes/deletenote".login required
router.delete('/deletenote/:id', fetchuser, async (req,res) =>{
    try {
    //Find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not found")}

    //Allow deletion only if user owns this note
    if(note.user.toString() !== req.user.id){
        return res.status(401).send("Not allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id)
    res.json({"success":"note has been deleted",note: note});
} catch (error) {
    console.error(error.message);
    res.status(500).send("internal server error");        
}

})

module.exports = router
