const express= require('express');
const app = express();

const path=require('path');

const noteModel = require('./models/notes');

app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');

app.get('/',async(req,res)=>{
    let notes =await noteModel.find();
    res.render('index',{notes});
});

app.get('/read/:id',async(req,res)=>{
    try{
        const note = await noteModel.findById(req.params.id);
        if(note){
            res.render('display',{note});
        }
        
    }
    catch{
        res.status(500).send('server error');
    }

});

app.get('/edit/:id',async(req,res)=>{
    const note = await noteModel.findById(req.params.id);
    res.render('edit',{note});
})

app.post('/update/:id',async(req,res)=>{
    let {title,description}=req.body;
    const note = await noteModel.findOneAndUpdate({_id:req.params.id},{title,description},{new:true});
     res.redirect('/');
})

app.get('/delete/:id',async(req,res)=>{
    let deleted = await noteModel.findOneAndDelete({_id:req.params.id});
    res.redirect('/');
})
app.post('/create',async(req,res)=>{
    let {title,description}=req.body;
    let note = await noteModel.create({
        title,
        description

    });

     res.redirect('/');

});




app.listen(3000);