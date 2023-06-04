const useMiddleware = (req, res, next) => {
    console.log("Request received:", req.url);
    next();
}

module.exports = useMiddleware;

