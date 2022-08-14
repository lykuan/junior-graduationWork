const {
  findArticles,
  findUsers,
  findQuestions,
} = require("../service/search.service");
class Search {
  async handleSearch(ctx, next) {
    const target = ctx.query;
    const limit = parseInt(ctx.query.limit);
    const skip = parseInt(ctx.query.skip);
    let query = JSON.parse(target.searchInfo).search.query;
    let allSearch = new Object();
    const searchArticles = await findArticles(query, limit, skip);
    const searchUsers = await findUsers(query, limit, skip);
    const searchQuestions = await findQuestions(query, limit, skip);
    console.log(searchArticles)
    allSearch.articles = searchArticles;
    allSearch.users = searchUsers;
    allSearch.questions = searchQuestions;
    ctx.body = allSearch;
  }
}

module.exports = new Search();
