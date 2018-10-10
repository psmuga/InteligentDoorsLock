import {sign} from '../../services/jwt'
import {success} from '../../services/response/'

export const login = (req, res, next) => {
  let user = req.user
  sign(user.id)
      .then(token => {return {token}})
    .then(success(res, 201))
    .catch(next)
}
