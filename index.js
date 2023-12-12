const express = require('express');
const app = express();
const dotenv = require('dotenv');

const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHander');
const cookieParser = require('cookie-parser');

dotenv.config();

const PORT = process.env.PORT || 4000;
dbConnect();
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
