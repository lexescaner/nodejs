const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const debug = require('debug')('app:bookRoutes');

const bookRouter = express.Router();

function router(nav) {

  bookRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017'; /* port 27017 is the standard port */
      const dbName = 'libraryApp';

      /* Create an async function */
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const books = await col.find().toArray();

          res.render('bookListView',
            {
              nav,
              title: 'Library',
              books /* placeholder for the const books */
            }
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  bookRouter.route('/:id') /* after : is the variable name */
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017'; /* port 27017 is the standard port */
      const dbName = 'libraryApp';

      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected correctly to server');

          const db = client.db(dbName);

          const col = await db.collection('books');

          const book = await col.findOne({ _id: new ObjectID(id) });
          debug(book);

          res.render('bookView',
            {
              nav,
              title: 'Library',
              book: book
            });
        } catch (err) {
          debug(err.stack);
        }
      }());
    });
  return bookRouter;
}

module.exports = router;
