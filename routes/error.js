const errorHandler = function(err, req, res, next){
    const error = {
        message: err.message,
        status: undefined
    };

    switch (err.message) {
        case "jwt must be provided":
        case "invalid token":
        case "invalid arguments":
            error.status = 400;
            break;

        case "jwt expired":
            error.status = 401;
            break;

        case "Token is blacklisted":
            error.status = 403;
            break;

        case "User already exists":
            error.status = 409;
            break;

        default:
            error.status = 500;
            break;
    }

    console.log(error);
    
    res.status(error.status);
    res.json(error);
}

module.exports = errorHandler;
