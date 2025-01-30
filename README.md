# NC News📰

![Stack](https://skillicons.dev/icons?i=js,nodejs,postgres,)

[Check it out here](https://nc-news-ttql.onrender.com/api)

# What is it?

This project is a RESTful API for NC News a place for news and disccusions. The api connects to a PostgresSQL database that stores articles, comments, topics and users. It provides various endpoints for fetching different articles, their relevant comments and information about who posted them.

## Features

- Retrieve articles with an assortment of queries to sort and filter the data
- Is able to post and delete comments
- Articles can be voted on
- Built using Node.js, Express.js and PostgresSQL

## Local Installation

```
1.create .env.devlopment and .env.test files in the root of the project\n
2.add the line PGDATABASE=nc_news in .env.devlopment
3.add the line PGDATABASE="nc_news_test" in .env.devlopment
```

Make sure you have Node.js, npm and PostgresSQL installed

[![Node.js](https://skillicons.dev/icons?i=nodejs)](https://nodejs.org/en/download) Requires Node.js v22.9.0  
[![Node.js](https://skillicons.dev/icons?i=postgres)](https://www.postgresql.org/download/) Requires PostgreSQL 14.15  
[![Node.js](https://skillicons.dev/icons?i=npm)](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) Requires npm 10.8.3

Clone the repo

```sh
git clone https://github.com/patrickfoulger1/nc_news
```

Install dependencies

```sh
npm i
```

Setup databases

```sh
npm run setup-dbs
```

Seed local database

```
npm run seed
```

Run tests

```sh
npm test
```

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
