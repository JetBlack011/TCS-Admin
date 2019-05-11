module.exports = (req, res) => {
    if (req.user) {
        res.render('404.html')
    } else {
        res.redirect('/login')
    }
}