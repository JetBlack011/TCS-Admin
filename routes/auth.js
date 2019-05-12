auth = {
  user: (req, res, next) => {
    if (req.user) {
      next()
    } else {
      res.redirect('/login')
    }
  },
  admin: (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next()
    } else {
      res.redirect('/login')
    }
  }
}

module.exports = auth