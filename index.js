const express = require('express');
const app = express();
const dotenv = require('dotenv');
const dbConnect = require('./config/dbConnect');
const authRouter = require('./routes/authRouter');
const productRouter = require('./routes/productRouter');
const blogRouter = require('./routes/blogRouter');
const categoryRouter = require('./routes/ProductCategoryRouter');
const blogcategoryRouter = require('./routes/blogCategoryRouter');
const brandRouter = require('./routes/brandRouter');
const couponRouter = require('./routes/couponRouter');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHander');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

dotenv.config();

const PORT = process.env.PORT || 4000;
dbConnect();
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/user', authRouter);
app.use('/api/product', productRouter);
app.use('/api/blog', blogRouter);
app.use('/api/category', categoryRouter);
app.use('/api/blogcategory', blogcategoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/coupon', couponRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
