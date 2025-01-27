const db = require("../../db/connection.js");
const articles = require("../../db/data/test-data/articles.js");

exports.selectArticles = async () => {
  const articleSql = `
    SELECT * FROM articles
    ORDER BY created_at DESC
    `;

  const { rows: articles, rowCount } = await db.query(articleSql);

  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `No articles found`,
    });
  } else {
    return articles;
  }
};

exports.modifyArticles = async (articles) => {
  const updatedArticles = await appendArticleCommentCount(articles);

  return removeArticlesBody(updatedArticles);
};

appendArticleCommentCount = async (articles) => {
  const commentSql = `
    SELECT article_id, COUNT(article_id) FROM COMMENTS 
    GROUP BY article_id
    `;
  const { rows: commentCounts } = await db.query(commentSql);

  const commentCountMap = new Map();
  commentCounts.forEach(({ article_id, count }) => {
    commentCountMap.set(article_id, Number(count));
  });

  return articles.map((originalArticle) => {
    const article = { ...originalArticle };
    const { article_id } = article;
    if (commentCountMap.has(article_id)) {
      article.comment_count = commentCountMap.get(article_id);
    } else {
      article.comment_count = 0;
    }

    return article;
  });
};

removeArticlesBody = (articles) => {
  return articles.map((originalArticle) => {
    const article = { ...originalArticle };
    delete article.body;

    return article;
  });
};

exports.selectArticleById = async (article_id) => {
  const articleSql = `
  SELECT * FROM articles
  WHERE article_id = $1
  `;

  const { rows: articles, rowCount } = await db.query(articleSql, [article_id]);
  if (rowCount === 0) {
    return Promise.reject({
      status: 404,
      message: `No article with the ID ${article_id} found`,
    });
  } else {
    return articles[0];
  }
};
