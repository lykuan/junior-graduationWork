async function filterTabooWords(ctx, next) {
  const { article_title, article_contentText } = ctx.request.body;
  const commonTabooWordsReg =
    /装逼|草泥马|特么的|撕逼|玛拉戈壁|爆菊|JB|呆逼|傻[叉币比逼狗]|屌|齐B短裙|.+骚.+|丢你老母|傻逼|.*狗.*|绿茶婊|你妈的|淫家|浮尸|.*妈.*|地方政府|地方议会/gi;

  const politicalTabooWordsReg = /针对台湾|中共|法轮功|党禁|中共恶霸/gi;
  const femaleTabooWordsReg =
    /阴道|阴唇|阴部|一夜[情欢]|淫[妇贱荡叫母女水液娃]/gi;
  const vulgarTabooWordsReg =
    /幼[男女]|欲[火女]|.+胸.+|欲仙欲死|.+穴.+|自慰|g[片点]|.妓.|[做作]爱|大[(鸡巴)屌吊]/gi;

  const arrs = [
    commonTabooWordsReg,
    politicalTabooWordsReg,
    femaleTabooWordsReg,
    vulgarTabooWordsReg,
  ];
  const res = arrs.some((i) => {
    return i.test(article_title) || i.test(article_contentText);
  });
  if (res) {
    ctx.body = {
      message: "文章中不能包含违禁词或敏感词",
    };
    return;
  } else {
   await next();
  }
}

module.exports = filterTabooWords;
