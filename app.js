const express = require('express'); /* // list of actual requires */
const chalk = require('chalk'); /* // allowing us to set colors on messages */
const debug = require('debug')('app'); /* // debug does not work in production, express uses debug too */
const morgan = require('morgan'); /* // morgan logs something to the console */
const path = require('path'); /* // path is built-in and no need to install */
const sql = require('mssql');

const app = express(); // create instance of express
const port = process.env.PORT || 8000;

const config = {
  user: 'library',
  password: '+InHim8080',
  server: 'lxej-pslibrary.database.windows.net',
  database: 'demo-app-pslibrary',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true
  }
};

sql.connect(config).catch((err) => debug(err));

app.use(morgan('tiny')); //  combined, tiny
app.use(express.static(path.join(__dirname, '/public/'))); /* // hej I am setting-up static directory to store static files */
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs'); /* use either pug or ejs */

const nav = [
  { link: '/books', title: 'Book' },
  { link: '/authors', title: 'Author' }
];

const bookRouter = require('./src/routes/bookRoutes')(nav); /* encapsulates all routes */

app.use('/books', bookRouter);
/* // when express GET a request to this route(verb) */
/* // __dirname means the location of the current executable */
app.get('/', (req, res) => {
  res.render('index',
    {
      nav: [{ link: '/books', title: 'Books' }, { link: '/authors', title: 'Authors' }],
      title: 'Library'
    }); /* Render a view called index; Look for where my views are at .src/views */
});

/* // because of ES6 */
app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
