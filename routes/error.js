const errorHandler = function(err, req, res, next){
    if(process.env.NODE_ENV == 'development'){
        console.log(err);
    }

    const error = {
        message: err.message,
        status: err.status
    };

    switch (error.message) {
        case "jwt must be provided":
            error.message = "Token must be provided";
            error.status = 400;
            break;

        case "invalid token":
            error.message = "Token is invalid";
            error.status = 400;
            break;

        case "invalid arguments":
            error.message = "Invalid arguments";
            error.status = 400;
            break;

        case "Username validation failed":
        case "Password validation failed":
            error.status = 400;
            break;

        case "User does not exist":
            error.status = 400;
            break;

        case "jwt expired":
            error.message = "Token is expired";
            error.status = 401;
            break;

        case "Token is blacklisted":
        case "Bad credentials":
            error.status = 401;
            break;

        case "Not found":
            error.status = 404;
            break;

        case "User already exists":
            error.status = 409;
            break;

        default:
            if(error.status === undefined){
                error.status = 500;
            }
            break;
    }

    res.status(error.status);
    res.json(error);
};

module.exports = errorHandler;
