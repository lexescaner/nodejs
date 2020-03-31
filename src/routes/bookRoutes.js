const express = require('express');
const bookRouter = express.Router();
const sql = require('mssql');
const debug = require('debug')('app:bookRoutes');

function router(nav) {
  const books = [
    {
      title: 'War and Peace',
      genre: 'Historical Fiction',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    },
    {
      title: 'Les Miserables',
      genre: 'Historical Fiction',
      author: 'Victor Hugo',
      read: false
    },
    {
      title: 'The Wind in the Willows',
      genre: 'Fantasy',
      author: 'Kenneth Grahame',
      read: false
    },
    {
      title: 'Life on the Mississippi',
      genre: 'History',
      author: 'Mark Twain',
      read: false
    },
    {
      title: 'Childhood',
      genre: 'Biography',
      author: 'Lev Nikolayevich Tolstoy',
      read: false
    }
  ];

  bookRouter.route('/')
    .get((req, res) => {
      (async function query() { /* Wrapped on async */
        const request = new sql.Request();
        const { recordset } = await request.query('select * from books');
        /* debug(result); */
        res.render('bookListView',
          {
            nav,
            title: 'Library',
            books: recordset /* placeholder for the const books */
          });
      }());
    });

  bookRouter.route('/:id') /* after : is the variable name */
    .get((req, res) => {
      (async function query() {
        const { id } = req.params;
        const request = new sql.Request();
        const { recordset } =
          await request.input('id', sql.Int, id)
            .query('select * from books where id = @id');
        debug(recordset);
        res.render('bookView',
          {
            nav,
            title: 'Library',
            book: recordset[0]
          });
      }());
    });
  return bookRouter;
}

module.exports = router;
