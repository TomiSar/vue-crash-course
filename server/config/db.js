import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `MongoDB Connected to database ${conn.connection.name} on host ${conn.connection.host}`
        .rainbow,
    );
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`.red);
    process.exit(1);
  }
};

export default connectDB;
