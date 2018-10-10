export const success = (res, status) => (entity) => {
    if (entity) {
        res.status(status || 200).json(entity)
    }
    return null
}

export const win = (res, status) => (entity) => {
    if (entity) {
        res.status(status || 200).json("<1>")
    }
    return null
}
export const fail = (res, status) => (entity) => {
    //if (entity) {
        res.status(status || 200).json("<0>")
    //}
    return null
}

export const notFound = (res) => (entity) => {
    if(!entity || entity.name === 'CastError')
        res.status(404).end()
    return entity
}