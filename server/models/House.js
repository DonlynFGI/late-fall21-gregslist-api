import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

export const HouseSchema = new Schema({
  address: { type: String, required: true },
  stories: { type: Number, required: true },
  imgUrl: { type: String },
  color: { type: String, required: true },
  price: { type: Number, required: true, min: 1 },
  description: { type: String, default: 'No Description Provided' },
  // One to Many relationship
  // Always how you connect created object to account
  creatorId: { type: ObjectId, required: true, ref: 'Profile' }
}, { timestamps: true, toJSON: { virtuals: true } })

// the fake property creator so we can populate and get the data from the relationship
HouseSchema.virtual('creator', {
  // what property on this object is it defined on
  localField: 'creatorId',
  // what collection do you want to pull from
  ref: 'Profile',
  // what is the property on that collection object
  foreignField: '_id',
  // safety clause for one to many
  justOne: true
})
