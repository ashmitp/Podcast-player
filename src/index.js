const express = require("express")
const path = require("path")
const app = express()
// const hbs = require("hbs")
const LogInCollection = require("./mongo")
const port = process.env.PORT || 3000
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))


// hbs.registerPartials(partialPath)


app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/', (req, res) => {
    res.render('login')
})



// app.get('/home', (req, res) => {
//     res.render('home')
// })

// app.post('/signup', async (req, res) => {
    
//     // const data = new LogInCollection({
//     //     name: req.body.name,
//     //     password: req.body.password
//     // })
//     // await data.save()

//     const data = {
//         name: req.body.name,
//         password: req.body.password
//     }

//     const checking = await LogInCollection.findOne({ name: req.body.name })

//    try{
//     if (checking.name === req.body.name && checking.password===req.body.password) {
//         res.send("user details already exists")
//     }
//     else{
//         await LogInCollection.insertMany([data])
//     }
//    }
//    catch{
//     res.send("wrong inputs")
//    }

//     res.status(201).render("home", {
//         naming: req.body.name
//     })
// })

app.post('/signup', async (req, res) => {
    const userData = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const existingUser = await LogInCollection.findOne({ name: userData.name });

        if (existingUser) {
            // If user exists, send a response and stop further execution
            return res.send("User details already exist");
        }

        // If user does not exist, insert new user
        await LogInCollection.insertMany([userData]);

        // Send successful response
        res.status(201).render("home", {
            redirectUrl: 'http://localhost:3000/login',
            naming: userData.name,
            
        });

        // if (signupSuccessful) {
        //     // Redirect to the music player page
        //     res.redirect('http://localhost:3000');
        // } else {
        //     // Handle errors or inform the user that signup failed
        //     res.send("Signup failed or user already exists");
        // }
    } catch (error) {
        // Handle any errors during the process
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// app.post('/login', async (req, res) => {

//     try {
//         const check = await LogInCollection.findOne({ name: req.body.name })

//         if (check.password === req.body.password) {
//             res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` })
//         }

//         else {
//             res.send("incorrect password")
//         }


//     } 
    
//     catch (e) {

//         res.send("wrong details")
        

//     }


// })

app.post('/login', async (req, res) => {
    try {
        const user = await LogInCollection.findOne({ name: req.body.name });

        if (user && user.password === req.body.password) {
            // Redirect to the music player page
            res.redirect('http://127.0.0.1:5500/frontend/index.html');
        } else {
            // Handle incorrect password
            res.send("Incorrect password");
        }
    } catch (e) {
        // Handle any other errors
        res.send("An error occurred");
    }
});

app.listen(port, () => {
    console.log('port connected');
})