const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

const exphbs = require('express-handlebars')
const restaurantList = require('./restaurant.json')

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(flash())
app.use(
  session({
    secret: 'test',
    resave: false,
    saveUninitialized: true
  })
)
app.use(function (req, res, next) {
  res.locals.flash_error_message = req.flash('flash_error_message')
  next()
})
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', { restaurant: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
  const restaurant = restaurantList.results.find(
    (restaurant) => restaurant.id.toString() === req.params.restaurant_id
  )
  res.render('show', { restaurant })
})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword.replace(/(^\s*)|(\s*$)/g, '')
  // 搜尋欄為空
  if (!keyword) {
    return res.redirect('/')
  }
  const restaurants = restaurantList.results.filter(
    (restaurant) =>
      restaurant.name.toLowerCase().includes(keyword.toLowerCase()) ||
      restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  )
  if (restaurants.length === 0) {
    req.flash('flash_error_message', `沒有符合搜尋結果: "${keyword}" 的餐廳。`)
    return res.redirect('/')
  }
  res.render('index', { restaurant: restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})
