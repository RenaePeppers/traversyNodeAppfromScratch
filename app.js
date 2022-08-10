const path = require('path')
const express = require('express')
//const mongoose = require('mongoose') //needed for the mongoStore for storing session in database
const dotenv = require('dotenv')
const morgan = require('morgan') //requests show in console. goes with if statement below
const exphbs = require('express-handlebars') //this is a template engine instead of ejs
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo') //stores session in database. DONT ADD SESSION TO THE END
const connectDB = require('./config/db')  //import a custom function from config/db.js


//load config
dotenv.config({path: './config/config.env'})

//Passport config
require('./config/passport')(passport)

connectDB()   //run the function that we imported above

const app=express()

// Body parser
app.use(express.urlencoded({ extended: false })) //this is needed to for stories.js router.post to work
app.use(express.json())  //we're not using this

// Method override
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  })
)



if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')) //in dev mode, it shows us requests in console
}

//handlebars helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs') 
const { isNullOrUndefined } = require('util')


//handlebars
app.engine('.hbs', exphbs.engine({  //mayan added .engine to keep it from throwing an error. mine worked without it
    helpers: {
      formatDate,
      stripTags,
      truncate,
      editIcon,
      select
    },
 defaultLayout: 'main',
  extname: '.hbs',
}));
app.set('view engine', '.hbs') //handlebars instead of ejs

//sessions middleware
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),  //stores session in database
    })
  )

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req, res, next){
  res.locals.user = req.user || null
  next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`))