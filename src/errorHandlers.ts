export const notFoundHandler = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ message: err.message })
    } else {
        next(err)
    }
}

export const badRequestHandler = (err, req, res, next) => {
    console.log(err.name)
    if (err.status === 400 || err.name === "ValidationError") {
        res.status(400).send({ message: err.errors || "Bad Request" })
    } else {
        next(err)
    }
}

export const genericErrorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ message: "Generic Server Error" })
} 

export const unauthorizedHandler = (err, req, res, next) => {
    if (err.status === 401) {
      res.status(401).send({
        status: "error",
        message: err.message || "You are not logged in!",
      })
    } else {
      next(err)
    }
  }
  
  export const forbiddenHandler = (err, req, res, next) => {
    if (err.status === 403) {
      res.status(403).send({
        status: "error",
        message: err.message || "You are not allowed to do that!",
      })
    } else {
      next(err)
    }
  }