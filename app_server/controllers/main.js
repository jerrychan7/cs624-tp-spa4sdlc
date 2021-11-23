const index = (req, res) => {
    res.render('index', {title: 'Express - For SPA4SDLC'})
};

module.exports = {
    index
};