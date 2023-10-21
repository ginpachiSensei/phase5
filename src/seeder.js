const dotenv = require("dotenv");
const productSample = require("./sample_data/products.js");
const userSample = require("./sample_data/users.js");
const productModel = require("./models/productModel.js");
const orderModel = require("./models/orderModel.js");
const userModel = require("./models/userModel.js");
const connectDB = require("./config/dbConfig.js");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await productModel.deleteMany();
    await orderModel.deleteMany();
    await userModel.deleteMany();

    const createdUsers = await userModel.insertMany(userSample);

    const adminUser = createdUsers[0]._id;

    const sampleProducts = productSample.map((product) => {
      return { ...product, user: adminUser };
    });

    await productModel.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
