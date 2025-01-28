require("jest-sorted");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const app = require("../app/app.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects with slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);

        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with article object with the id :article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });

  test("404: Responds with error 'Article with id <article_id> does not exist' when no article exists with article_id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article with id 999 does not exist");
      });
  });

  test("400: Responds with 'Bad Request' when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });

  test("200: Response articles should not have body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article.body).toBe(undefined);
        });
      });
  });

  test("200: Response articles should be sorted by date descending", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ descending: true, key: "created_at" });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with array of comment objects with an article_id of :article Id", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            votes: expect.any(Number),
            body: expect.any(String),
          });
        });
      });
  });

  test("200: Response comments should be sorted by date most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSorted({ descending: true, key: "created_at" });
      });
  });

  test("200: Response should be empty array if article has no comments", () => {
    return (
      request(app)
        .get("/api/articles/2/comments")
        //.expect(200)
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);
          expect(comments.length).toBe(0);
        })
    );
  });

  test("400: 400: Responds with 'Bad Request' when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });

  test("404:Responds with 'Article with id <article_id> does not exist' article dosen't exist", () => {
    return request(app)
      .get("/api/articles/55/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article with id 55 does not exist");
      });
  });
});
