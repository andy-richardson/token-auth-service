const errorHandler = function(err, req, res, next){
    if(process.env.NODE_ENV == 'development'){
        console.log(err);
    }

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

        case "Not found":
            error.status = 404;
            break;

        case "User already exists":
            error.status = 409;
            break;

        default:
            error.status = 500;
            break;
    }

    res.status(error.status);
    res.json(error);
}

module.exports = errorHandler;
