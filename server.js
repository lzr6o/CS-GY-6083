if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')

const index_router = require('./routes/index')
const admin_router = require('./routes/admin')
const author_router = require('./routes/author')
const customer_router = require('./routes/customer')
const register_router = require('./routes/register')
const login_router = require('./routes/login')

const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/books')
const customerRouter = require('./routes/customers')
const paymentRouter = require('./routes/payments')
const rentalRouter = require('./routes/rentals')
const topicRouter = require('./routes/topics')
const eventRouter = require('./routes/events')
const copyRouter = require('./routes/copies')
const invoiceRouter = require('./routes/invoices')
const roomRouter = require('./routes/rooms')
const reservationRouter = require('./routes/reservations')
const registrationRouter = require('./routes/registrations')
const invitationRouter = require('./routes/invitations')
const sponsorRouter = require('./routes/sponsors')
const fundRouter = require('./routes/funds')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(express.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', index_router)
app.use('/register', register_router)
app.use('/login', login_router)
app.use('/admin', admin_router)
app.use('/author', author_router)
app.use('/customer', customer_router)

app.use('/authors', authorRouter)
app.use('/books', bookRouter)
app.use('/customers', customerRouter)
app.use('/payments', paymentRouter)
app.use('/rentals', rentalRouter)
app.use('/topics', topicRouter)
app.use('/events', eventRouter)
app.use('/copies', copyRouter)
app.use('/invoices', invoiceRouter)
app.use('/rooms', roomRouter)
app.use('/reservations', reservationRouter)
app.use('/registrations', registrationRouter)
app.use('/invitations', invitationRouter)
app.use('/sponsors', sponsorRouter)
app.use('/funds', fundRouter)

app.listen(process.env.PORT || 3000)