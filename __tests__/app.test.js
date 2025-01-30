require("jest-sorted");
const seed = require("../db/seeds/seed");
const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection");
const app = require("../app/app.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("Invalid endpoint", () => {
  test("404: Responds with 'Endpoint not found' when handling requests to endpoints that don't exist", () => {
    return request(app)
      .get("/api/notanendpoint")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Endpoint not found");
      });
  });
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

  test("400: Responds with Bad Request error message when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/notanumber")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });

  test("200: Article should have comment_count property with count of comments", () => {
    return request(app)
      .get("/api/articles/5")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count", 2);
      });
  });

  test("200: If article has no comments it should be 0", () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toHaveProperty("comment_count", 0);
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
            topic: expect.any(String),
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

  test("200: sort_by query should sort by any valid column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted({ descending: true, key: "title" });
      });
  });

  test("200: order query should change the sort direction asc or desc", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSorted("title");
      });
  });

  test("400: When given an invalid sort_by query should respond with Bad Request error message", () => {
    return request(app)
      .get("/api/articles?sort_by=asc")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: asc is an invalid query");
      });
  });

  test("400: When given an invalid order query should respond with Bad Request error message", () => {
    return request(app)
      .get("/api/articles?order=banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: banana is an invalid query");
      });
  });
  test("200: topic query should filter down response to just articles that match the topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });

  test("200: Responds with empty array if the topic does exist but no articles match it", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(0);
      });
  });

  test("404: Responds with message describing topic doesn't exist if topic is not in database", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("The topic banana does not exist");
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

  test("400:Responds with Bad Request error message when article_id is not a valid number", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });

  test("404:Responds with 'Article with id <article_id> does not exist' article doesn't exist", () => {
    return request(app)
      .get("/api/articles/55/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article with id 55 does not exist");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Adds comment from request body to specified article and responds with comment posted", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "lurker",
        body: "wow what a cool article",
      })
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          comment_id: 19,
          body: "wow what a cool article",
          article_id: 1,
          author: "lurker",
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });

  test("404: Responds with 'Article with id <article_id> does not exist' when article doesn't exist", () => {
    return request(app)
      .post("/api/articles/90/comments")
      .send({
        username: "lurker",
        body: "wow what a cool article",
      })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article with id 90 does not exist");
      });
  });

  test("400: Responds with Bad Request error message when article_id is not a valid number", () => {
    return request(app)
      .post("/api/articles/banana/comments")
      .send({
        username: "lurker",
        body: "wow what a cool article",
      })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });

  test("400: Responds with error describing missing keys when posted comment is missing keys", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment is missing username and body keys");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Increments articles votes by inc_votes value on request object responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 50 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: 1,
          created_at: expect.any(String),
          votes: 150,
          article_img_url: expect.any(String),
        });
      });
  });

  test("200: Works when inc vote is a negative value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -50 })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          created_at: expect.any(String),
          votes: 50,
          article_img_url: expect.any(String),
          topic: expect.any(String),
        });
      });
  });

  test("404: Responds with 'Article with id <article_id> does not exist' when article doesn't exist", () => {
    return request(app)
      .patch("/api/articles/76")
      .send({ inc_votes: 50 })
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Article with id 76 does not exist");
      });
  });

  test("400: Responds with Bad Request error message when article_id is not a valid number", () => {
    return request(app)
      .patch("/api/articles/banana")
      .send({ inc_votes: 50 })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });

  test("400: Responds with error describing missing inc_vote when key is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: NOT NULL VIOLATION");
      });
  });

  test("400: Responds with error when inc_vote is wrong data type", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: true })
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: On successful deletion of comment", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("404: If comment with given id does not exist", () => {
    return request(app)
      .delete("/api/comments/20")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("Comment with id 20 does not exist");
      });
  });

  test("400: If given id is invalid", () => {
    return request(app)
      .delete("/api/comments/banana")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request: Invalid Text Representation");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of topic objects with username, name, avatar_url properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/users/:username", () => {
  test("200: Should respond with user of given username", () => {
    return request(app)
      .get("/api/users/rogersop")
      .expect(200)
      .then(({ body: { user } }) => {
        expect(user).toMatchObject({
          username: expect.any(String),
          avatar_url: expect.any(String),
          name: expect.any(String),
        });
      });
  });

  test("404: If username doesn't exist return a username not found", () => {
    return request(app)
      .get("/api/users/jolly")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("No user with the username jolly found");
      });
  });
});
