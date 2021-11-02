import { Auth0Provider } from '@bcwdev/auth0provider'
import { housesService } from '../services/HousesService'
import BaseController from '../utils/BaseController'

export class HousesController extends BaseController {
  constructor() {
    super('api/houses')
    this.router
      .get('', this.getAll)
      .get('/:id', this.getById)
      // you cant do this unless you are logged in
      // GateKeeper: All things beyond this point must be logged in
      .use(Auth0Provider.getAuthorizedUserInfo)
      .post('', this.create)
      .put('/:id', this.edit)
      .delete('/:id', this.remove)
  }

  async getAll(req, res, next) {
    try {
      // capture the data from the query
      const query = req.query
      // send to the service
      const houses = await housesService.getAll(query)
      return res.send(houses)
    } catch (error) {
      next(error)
    }
  }

  async getById(req, res, next) {
    try {
      const house = await housesService.getById(req.params.id)
      return res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async create(req, res, next) {
    try {
      // NEVER TRUST THE CLIENT TO TELL YOU WHO THEY ARE
      // req.userInfo is the creds validated by auth0 token
      req.body.creatorId = req.userInfo.id
      const car = await housesService.create(req.body)
      return res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async edit(req, res, next) {
    try {
      // DONT TRUST THE USER
      req.body.creatorId = req.userInfo.id
      // attach the id incase its not there
      req.body.id = req.params.id
      const house = await housesService.edit(req.body)
      return res.send(house)
    } catch (error) {
      next(error)
    }
  }

  async remove(req, res, next) {
    try {
      const userId = req.userInfo.id
      const houseId = req.params.id
      await housesService.remove(houseId, userId)
      res.send('Successfully Deleted')
    } catch (error) {
      next(error)
    }
  }
}
