const dotenv = require("dotenv");
const products = require("./sample_data/products.js");
const productModel = require("./models/productModel.js");
const connectDB = require("./config/dbConfig.js");

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await productModel.deleteMany();

    const sampleProducts = products.map((product) => {
      return { ...product };
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
    await productModel.deleteMany();
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
