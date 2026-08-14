import mongoose from 'mongoose';

const schemaOptions = {
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: { virtuals: true },
};

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    contactEmail: String,
    contactPhone: String,
  },
  { _id: false },
);

const jobSchema = new mongoose.Schema(
  {
    type: String,
    title: { type: String, required: true },
    description: String,
    salary: String,
    location: String,
    company: { type: companySchema, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  schemaOptions,
);

export default mongoose.model('Job', jobSchema);
