import { dbContext } from '../db/DbContext'
import { BadRequest, Forbidden } from '../utils/Errors'

class HousesService {
  // set the query to either the data passed or default to {} (match all)
  async getAll(query = {}) {
    // find looks for all objects that match the provided object pattern
    // if passed an empty object, will find all items
    // populate goes and gets extra data based on the property provided, given it is a relationship
    const houses = await dbContext.Houses.find(query).populate('creator', 'name picture')
    return houses
  }

  async getById(id) {
    const house = await dbContext.Houses.findById(id).populate('creator', 'name picture')
    if (!house) {
      throw new BadRequest('Invalid house Id')
    }
    return house
  }

  async create(body) {
    const house = await dbContext.Houses.create(body)
    return house
  }

  async edit(body) {
    // check that the car exists
    const house = await this.getById(body.id)
    // check if the car is yours
    if (house.creatorId.toString() !== body.creatorId) {
      throw new Forbidden('This is not your car')
    }
    // findOne allows to check multiple properties
    const update = dbContext.Houses.findOneAndUpdate({ _id: body.id, creatorId: body.creatorId }, body, { new: true })
    return update
  }

  async remove(houseId, userId) {
    // use getById because it will already handle the null check and throw an error if its a badId
    const house = await this.getById(houseId)
    // NOTE the car creatorId is type ObjectId, it cannot be compared to a string
    // convert toString and you are all set
    if (house.creatorId.toString() !== userId) {
      throw new Forbidden('This is not your car')
    }
    await dbContext.Houses.findByIdAndDelete(houseId)
  }
}

export const carsService = new HousesService()
