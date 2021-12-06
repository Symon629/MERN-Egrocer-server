const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const authJwt = require('./helpers/jwt');
const productsRouter = require('./routers/products');
const cors = require('cors');
const categoryRouter = require('./routers/categories');
const errorHandler = require('./helpers/errorHandler');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/orders');

app.use(cors());
app.options('*', cors());
require('dotenv/config');
const api = process.env.API_URL;

app.use(morgan('tiny'));
app.use(express.json());
app.use(authJwt());
app.use('/images/uploads', express.static(__dirname + '/images/uploads'));

app.use(errorHandler);

app.use(`${api}/products`, productsRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

const DB = process.env.DB_URL.replace('<PASSWORD>', process.env.DB_PASSWORD);
console.log(DB);
mongoose.connect(DB).then(() => {
  console.log('DB connection succesfuul');
});

//Development server
// app.listen(3000, () => {
//   console.log('Server is running on http://localhost:3000');
// });

let server = app.listen(process.env.PORT || 3000, function () {
  let port = server.address().port;

  console.log('Express is working on port ' + port);
});
