const validator = require('validator');

function validateMongoId(req, res, next) {
    if(!validator.isMongoId(req.params.id)) {
        res.status(404).json({error: 'Not Found'});
    } else {
        next();
    }
}

module.exports = {
  validateMongoId
};
