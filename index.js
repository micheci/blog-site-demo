const express=require('express');
const path=require('path')
const dotenv=require('dotenv');
const connectDB=require('./config/db')
const morgan=require('morgan')
const passport=require('passport')
const exphbs=require('express-handlebars')
const session=require('express-session')


//load config
dotenv.config({path:'./config/config.env'})

//Passport
require('./config/passport')(passport)

connectDB()
const app=express();

if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//handlebars
app.engine('.hbs',exphbs.engine(
    {extname:'.hbs',
    defaultLayout:'main'}
    ))
app.set('view engine','hbs')

//Session middleware
app.use(
    session({
        secret:'keyboard cat',
        resave:false,
        saveUninitialized:true,
        cookie:{secure:true}
}))

//Passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Static folders
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/',require('./routes/index'))
app.use('/auth',require('./routes/auth'))
//app.use('/dashboard',require('./routes/index'))

const PORT=process.env.PORT || 5000
 

app.listen(PORT,console.log(`server in ${PORT}`))