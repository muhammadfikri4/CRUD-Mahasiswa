const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require("express-validator");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
require("./layouts/utils/db");
const mhs = require("./model/mahasiswa");
const app = express();
const port = 3000;
const methodOverride = require('method-override');


// Configure EJS
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true}));

// Configure Flash
app.use(cookieParser('secret'));
app.use(session({
    cookie: { maxAge: 60000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

app.use(methodOverride('_method'));

// Routing
app.get ("/", (req, res) => {
    // res.render("Hello World!")
    // mhs.find().then((mhs) => {
    //     res.send(mhs);
    // });
    res.render('index', {
        title:"Home Page",
        layout: "../layouts/main-layouts.ejs"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About Page",
        layout: "../layouts/main-layouts.ejs"
    })
})

app.get("/student", async (req, res) => {
    const mahasiswa = await mhs.find();
    const msg = req.flash('msg');
    res.render("student", {
        title: "Student Page",
        layout: "../layouts/main-layouts.ejs",
        mahasiswa,
        msg
    })
})

// Create Data
app.post('/student', [
    body('nama').custom(async value => {
            const duplicateName = await mhs.findOne({nama: value});
            if (duplicateName) {
                throw new Error("Name is already exist!");
            }
            return true;
        }),
    body('nim').custom(async value => {
        const duplicateNim = await mhs.findOne({nim: value});
        if (duplicateNim) {
            throw new Error("NIM is already exist!");
        }
        return true;
    }),
    body('email').custom(async value => {
        const duplicateEmail = await mhs.findOne({email: value});
        if (duplicateEmail) {
            throw new Error("Email is already exist!");
        }
        return true;
    }),
    check('email', "Your Email is wrong!").isEmail()
    ], 
    async (req, res) => {

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            
        const msg = req.flash('msg');
        const mahasiswa = await mhs.find();
        res.render('student', {
            title: "Student Page",
            layout: "../layouts/main-layouts.ejs",
            errors: errors.array(),
            mahasiswa,
            msg   
        })  
        } else {
            // const reqBody = new mhs(req.body);
            // reqBody.save()
            mhs.insertMany(req.body).then(() => {
            req.flash('msg', "Data Added Successfully!");
            // res.redirect('/student');
            console.log(req.body);
            })
            
            }
        }
    )

// Delete Data

app.delete('/student', (req, res) => {
    mhs.deleteOne({nama: req.body.nama}).then(() => {
        req.flash('msg', 'Data Deleted Successfully!');
        res.redirect('/student');
    })
})

// Update Data

app.put('/student', [
    body('nama').custom(async (value, {req}) => {
            const duplicateName = await mhs.findOne({nama: value});
            if (value !== req.body.oldName && duplicateName) {
                throw new Error("Name is already exist!");
            }
            return true;
        }),
    body('nim').custom(async(value, {req}) => {
        const duplicateNim = await mhs.findOne({nim: value});
        if (value !== req.body.oldNim && duplicateNim) {
            throw new Error("NIM is already exist!");
        }
        return true;
    }),
    body('email').custom(async(value, {req}) => {
        const duplicateEmail = await mhs.findOne({email: value});
        if (value !== req.body.oldEmail && duplicateEmail) {
            throw new Error("Email is already exist!");
        }
        return true;
    }),
    check('email', "Your Email is wrong!").isEmail()
    ],
    async (req, res) => {
    
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            const mahasiswa = await mhs.find();
            const msg = req.flash('msg');
            res.render('student', {
                title: "Student Page",
                layout: "../layouts/main-layouts.ejs",
                errors: errors.array(),
                mahasiswa,
                msg
                
            })
            console.log(errors);
            
        } else {
            // replaceMhs(req.body.oldName, req.body.nama, req.body.nim, req.body.email, req.body.fakultas, req.body.prodi);
            // res.send(req.body);
            
            mhs.updateOne(
                { _id: req.body._id },
                {
                    $set: {
                        nama: req.body.nama,
                        nim: req.body.nim,
                        email: req.body.email,
                        fakultas: req.body.fakultas,
                        prodi: req.body.prodi
                    }
                }
            ).then(() => {
                req.flash('msg', "Data Update Successfully!");
                res.redirect('/student');
            })
            
        }
    })


app.use((req, res) => {
    res.status(404);
    res.send("<h1>404 NOT FOUND</h1>");
    
});

app.listen(port, () => {
    console.log(`Server Connected To Port http://localhost:${port}`)
})




// [
//     body('nama').custom(value => {
//             const duplicateName = checkDuplicateName(value);
//             if (duplicateName) {
//                 throw new Error("Name is already exist!");
//             }
//             return true;
//         }),
//     body('nim').custom(value => {
//         const duplicateNim = checkDuplicateNim(value);
//         if (duplicateNim) {
//             throw new Error("NIM is already exist!");
//         }
//         return true;
//     }),
//     body('email').custom(value => {
//         const duplicateEmail = checkDuplicateEmail(value);
//         if (duplicateEmail) {
//             throw new Error("Email is already exist!");
//         }
//         return true;
//     }),
//     check('email', "Your Email is wrong!").isEmail()
//     ],
//     async (req, res) => {
    
//         const errors = validationResult(req);
//         if(!errors.isEmpty()) {
//             // const dataMhs = loadMhs();
//             const mahasiswa = await mhs.find();
//             const msg = req.flash('msg');
//             res.render('student', {
//                 title: "Student Page",
//                 layout: "../layouts/main-layouts.ejs",
//                 errors: errors.array(),
//                 mahasiswa,
//                 msg
                
//             })
//             console.log(errors);
            
//         }