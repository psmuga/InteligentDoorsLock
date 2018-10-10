import {notFound, success} from '../../services/response/'
import User from './model'

export const showMe = ({ user }, res) =>
  res.json(user.view())

export const create = (req, res, next) => {
  const { body: {email, password, name} } = req

  User.create({email, password, name})
      .then((user) => user.view())
    .then(success(res, 201))
    .catch((err) => {
      /* istanbul ignore else */
      if (err.code === 11000) {
        res.status(409).json({
          valid: false,
          param: 'email',
          message: 'email already registered'
        })
      } else {
        next(err)
      }
    })
}

export const update = ({body, params, user}, res, next) => {
    const {email, password, name} = body

    User.findById(params.id === 'me' ? user.id : params.id)
        .then(notFound(res))
        .then((result) => {
            if (!result) return null

            const isSelfUpdate = user.id === result.id
            if (isSelfUpdate) return result

            const isAdmin = user.role === 'admin'
            if (!isAdmin) {
                res.status(401).json({
                    valid: false,
                    message: 'You can\'t change other user\'s data'
                })
                return null
            }
            return result
        })
        .then((user) => {
            return user ? Object.assign(user, {email, password, name}).save() : null
        })
        .then((user) => user ? user.view('full') : null)
        .then(success(res))
        .catch(next)
}


export const destroy = ({ params }, res, next) =>
  User.findById(params.id)
    .then(notFound(res))
    .then((user) => user ? user.remove() : null)
    .then(success(res, 204))
    .catch(next)
