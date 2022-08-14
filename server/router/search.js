const Router = require("koa-router");
const {handleSearch} = require('../controllers/search')
const searchRouter = new Router();

searchRouter.get("/search", handleSearch);

module.exports = searchRouter;
