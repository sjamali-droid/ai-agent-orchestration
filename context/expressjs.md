# Express.js

> **Used by**: Developer
> **What to paste**: routing API, middleware patterns, error handling, req/res API, app.listen config.
> **Source**: https://expressjs.com/en/api.html

<!-- PASTE CONTEXT BELOW THIS LINE -->


# Express.js

Express is a fast, unopinionated, minimalist web framework for Node.js. It provides a robust set of features for building single-page applications, websites, hybrids, and public HTTP APIs. Express is the de facto standard server framework for Node.js, offering robust routing, HTTP helpers for redirection and caching, support for 14+ template engines, and content negotiation capabilities.

Express does not force you to use any specific ORM or template engine, allowing you to craft your perfect framework. The philosophy centers on providing small, robust tooling for HTTP servers while maintaining flexibility. With middleware support and a simple API, Express enables rapid development of web applications with minimal boilerplate code.

## Installation

```bash
npm install express
```

## Creating a Basic Express Application

Express applications are created by calling the `express()` function, which returns an app object used to configure routes and middleware.

```javascript
import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})
```

## HTTP Route Methods

Express provides methods for all HTTP verbs (GET, POST, PUT, DELETE, etc.) to define route handlers for different endpoints.

```javascript
'use strict'

var express = require('express');
var app = express();

// GET request
app.get('/', function(req, res) {
  res.send('Hello World');
});

// POST request
app.post('/users', function(req, res) {
  res.send('User created');
});

// PUT request
app.put('/users/:id', function(req, res) {
  res.send('User ' + req.params.id + ' updated');
});

// DELETE request
app.delete('/users/:id', function(req, res) {
  res.send('User ' + req.params.id + ' deleted');
});

app.listen(3000);
console.log('Express started on port 3000');
```

## Route Parameters

Route parameters are named URL segments used to capture values at specific positions in the URL. Use `req.params` to access captured values.

```javascript
'use strict'

var createError = require('http-errors')
var express = require('express');
var app = express();

// Faux database
var users = [
  { name: 'tj' },
  { name: 'tobi' },
  { name: 'loki' },
  { name: 'jane' },
  { name: 'bandit' }
];

// Convert :to and :from to integers using app.param()
app.param(['to', 'from'], function(req, res, next, num, name) {
  req.params[name] = parseInt(num, 10);
  if (isNaN(req.params[name])) {
    next(createError(400, 'failed to parseInt ' + num));
  } else {
    next();
  }
});

// Load user by id using app.param()
app.param('user', function(req, res, next, id) {
  req.user = users[id]
  if (req.user) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

app.get('/', function(req, res) {
  res.send('Visit /user/0 or /users/0-2');
});

// Single user route - GET /user/0
app.get('/user/:user', function(req, res) {
  res.send('user ' + req.user.name);
});

// Range route - GET /users/0-2
app.get('/users/:from-:to', function(req, res) {
  var from = req.params.from;
  var to = req.params.to;
  var names = users.map(function(user) { return user.name; });
  res.send('users ' + names.slice(from, to + 1).join(', '));
});

app.listen(3000);
console.log('Express started on port 3000');
```

## express.Router() - Modular Route Handlers

The `express.Router` class creates modular, mountable route handlers. A Router instance is a complete middleware and routing system, often referred to as a "mini-app".

```javascript
'use strict'

var express = require('express');
var app = express();

// Create API v1 router
var apiv1 = express.Router();

apiv1.get('/', function(req, res) {
  res.send('Hello from APIv1 root route.');
});

apiv1.get('/users', function(req, res) {
  res.send('List of APIv1 users.');
});

// Create API v2 router
var apiv2 = express.Router();

apiv2.get('/', function(req, res) {
  res.send('Hello from APIv2 root route.');
});

apiv2.get('/users', function(req, res) {
  res.send('List of APIv2 users.');
});

// Mount routers
app.use('/api/v1', apiv1);
app.use('/api/v2', apiv2);

app.get('/', function(req, res) {
  res.send('Hello from root route.')
});

// curl http://localhost:3000/api/v1/users
// curl http://localhost:3000/api/v2/users

app.listen(3000);
console.log('Express started on port 3000');
```

## Middleware Functions

Middleware functions have access to the request object, response object, and the next middleware function. They can execute code, modify req/res, end the request-response cycle, or call the next middleware.

```javascript
'use strict'

var express = require('express');
var app = express();

// Placeholder users
var users = [
  { id: 0, name: 'tj', email: 'tj@vision-media.ca', role: 'member' },
  { id: 1, name: 'ciaran', email: 'ciaranj@gmail.com', role: 'member' },
  { id: 2, name: 'aaron', email: 'aaron.heckmann+github@gmail.com', role: 'admin' }
];

// Middleware: Load user from database
function loadUser(req, res, next) {
  var user = users[req.params.id];
  if (user) {
    req.user = user;
    next();
  } else {
    next(new Error('Failed to load user ' + req.params.id));
  }
}

// Middleware: Restrict to self
function andRestrictToSelf(req, res, next) {
  if (req.authenticatedUser.id === req.user.id) {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
}

// Middleware factory: Restrict to role
function andRestrictTo(role) {
  return function(req, res, next) {
    if (req.authenticatedUser.role === role) {
      next();
    } else {
      next(new Error('Unauthorized'));
    }
  }
}

// Faux authentication middleware
app.use(function(req, res, next) {
  req.authenticatedUser = users[0];
  next();
});

app.get('/', function(req, res) {
  res.redirect('/user/0');
});

// Chained middleware
app.get('/user/:id', loadUser, function(req, res) {
  res.send('Viewing user ' + req.user.name);
});

app.get('/user/:id/edit', loadUser, andRestrictToSelf, function(req, res) {
  res.send('Editing user ' + req.user.name);
});

app.delete('/user/:id', loadUser, andRestrictTo('admin'), function(req, res) {
  res.send('Deleted user ' + req.user.name);
});

// curl http://localhost:3000/user/0
// curl http://localhost:3000/user/0/edit
// curl -X DELETE http://localhost:3000/user/0

app.listen(3000);
console.log('Express started on port 3000');
```

## express.static() - Serving Static Files

Express provides built-in middleware `express.static` to serve static files such as images, CSS files, and JavaScript files.

```javascript
'use strict'

var express = require('express');
var logger = require('morgan');
var path = require('node:path');
var app = express();

// Log requests
app.use(logger('dev'));

// Serve static files from "public" directory
// GET /js/app.js -> ./public/js/app.js
app.use(express.static(path.join(__dirname, 'public')));

// Mount static files with prefix
// GET /static/js/app.js -> ./public/js/app.js
app.use('/static', express.static(path.join(__dirname, 'public')));

// Serve specific subdirectory
// GET /style.css -> ./public/css/style.css
app.use(express.static(path.join(__dirname, 'public', 'css')));

app.listen(3000);
console.log('listening on port 3000');
console.log('try:');
console.log('  GET /hello.txt');
console.log('  GET /js/app.js');
console.log('  GET /css/style.css');
```

## res.json() and res.send() - Sending Responses

Express provides multiple methods for sending responses including `res.send()` for general responses and `res.json()` for JSON data.

```javascript
'use strict'

var express = require('express');
var app = express();

// Create an error with status
function error(status, msg) {
  var err = new Error(msg);
  err.status = status;
  return err;
}

// API key validation middleware
var apiKeys = ['foo', 'bar', 'baz'];

app.use('/api', function(req, res, next) {
  var key = req.query['api-key'];
  if (!key) return next(error(400, 'api key required'));
  if (apiKeys.indexOf(key) === -1) return next(error(401, 'invalid api key'))
  req.key = key;
  next();
});

// Faux database
var repos = [
  { name: 'express', url: 'https://github.com/expressjs/express' },
  { name: 'stylus', url: 'https://github.com/learnboost/stylus' },
  { name: 'cluster', url: 'https://github.com/learnboost/cluster' }
];

var users = [
  { name: 'tobi' },
  { name: 'loki' },
  { name: 'jane' }
];

var userRepos = {
  tobi: [repos[0], repos[1]],
  loki: [repos[1]],
  jane: [repos[2]]
};

// res.send() - sends array as JSON
app.get('/api/users', function(req, res) {
  res.send(users);
});

app.get('/api/repos', function(req, res) {
  res.send(repos);
});

app.get('/api/user/:name/repos', function(req, res, next) {
  var name = req.params.name;
  var user = userRepos[name];
  if (user) res.send(user);
  else next();
});

// Error handling middleware (4 arguments)
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send({ error: err.message });
});

// 404 handler
app.use(function(req, res) {
  res.status(404);
  res.send({ error: "Sorry, can't find that" })
});

// curl http://localhost:3000/api/users?api-key=foo
// curl http://localhost:3000/api/repos?api-key=foo
// curl http://localhost:3000/api/user/tobi/repos?api-key=foo

app.listen(3000);
console.log('Express started on port 3000');
```

## res.format() - Content Negotiation

The `res.format()` method performs content-negotiation on the Accept HTTP header, allowing different response formats based on client preferences.

```javascript
'use strict'

var express = require('express');
var app = express();

var users = [
  { name: 'tobi' },
  { name: 'loki' },
  { name: 'jane' }
];

app.get('/', function(req, res) {
  res.format({
    html: function() {
      res.send('<ul>' + users.map(function(user) {
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },

    text: function() {
      res.send(users.map(function(user) {
        return ' - ' + user.name + '\n';
      }).join(''));
    },

    json: function() {
      res.json(users);
    }
  });
});

// curl http://localhost:3000/
// curl http://localhost:3000/ -H "Accept: application/json"
// curl http://localhost:3000/ -H "Accept: text/plain"

app.listen(3000);
console.log('Express started on port 3000');
```

## res.render() - Template Rendering

Express supports view rendering with template engines. Configure views directory and engine, then use `res.render()` to render templates.

```javascript
'use strict'

var express = require('express');
var path = require('node:path');
var app = express();

// Register ejs as .html engine
app.engine('.html', require('ejs').__express);

// Set views directory
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set default view engine
app.set('view engine', 'html');

// Placeholder users
var users = [
  { name: 'tobi', email: 'tobi@learnboost.com' },
  { name: 'loki', email: 'loki@learnboost.com' },
  { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res) {
  res.render('users', {
    users: users,
    title: "EJS example",
    header: "Some users"
  });
});

app.listen(3000);
console.log('Express started on port 3000');
```

## Error Handling

Express error-handling middleware has four arguments: `(err, req, res, next)`. Define error handlers after all other middleware and routes.

```javascript
'use strict'

var express = require('express');
var path = require('node:path');
var app = express();

// Configure views
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Enable verbose errors in development
app.enable('verbose errors');
if (app.settings.env === 'production') app.disable('verbose errors')

// Routes
app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/404', function(req, res, next) {
  // Trigger 404
  next();
});

app.get('/403', function(req, res, next) {
  var err = new Error('not allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next) {
  next(new Error('keyboard cat!'));
});

// 404 handler - last non-error middleware
app.use(function(req, res, next) {
  res.status(404);
  res.format({
    html: function() {
      res.render('404', { url: req.url })
    },
    json: function() {
      res.json({ error: 'Not found' })
    },
    default: function() {
      res.type('txt').send('Not found')
    }
  })
});

// Error handler - 4 argument signature
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('500', { error: err });
});

// curl http://localhost:3000/notfound
// curl http://localhost:3000/notfound -H "Accept: application/json"

app.listen(3000);
console.log('Express started on port 3000');
```

## res.cookie() and Cookie Handling

Express provides methods for setting and clearing cookies. Use the `cookie-parser` middleware to parse incoming cookies.

```javascript
'use strict'

var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();

// Parse cookies with secret for signing
app.use(cookieParser('my secret here'));

// Parse URL-encoded bodies
app.use(express.urlencoded())

app.get('/', function(req, res) {
  if (req.cookies.remember) {
    res.send('Remembered :). Click to <a href="/forget">forget</a>!.');
  } else {
    res.send('<form method="post"><p>Check to <label>'
      + '<input type="checkbox" name="remember"/> remember me</label> '
      + '<input type="submit" value="Submit"/>.</p></form>');
  }
});

app.get('/forget', function(req, res) {
  res.clearCookie('remember');
  res.redirect(req.get('Referrer') || '/');
});

app.post('/', function(req, res) {
  var minute = 60000;
  if (req.body && req.body.remember) {
    res.cookie('remember', 1, { maxAge: minute })
  }
  res.redirect(req.get('Referrer') || '/');
});

app.listen(3000);
console.log('Express started on port 3000');
```

## Session Management

Use `express-session` middleware to add session support. Sessions are stored server-side with only the session ID in the cookie.

```javascript
'use strict'

var express = require('express');
var session = require('express-session');
var app = express();

// Session middleware
app.use(session({
  resave: false,            // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  secret: 'keyboard cat'
}));

app.get('/', function(req, res) {
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed <strong>' + req.session.views + '</strong> times.</p>');
});

app.listen(3000);
console.log('Express started on port 3000');
```

## res.download() - File Downloads

The `res.download()` method transfers a file as an attachment, prompting the browser to download it.

```javascript
'use strict'

var express = require('express');
var path = require('node:path');
var app = express();

// Path to files directory
var FILES_DIR = path.join(__dirname, 'files')

app.get('/', function(req, res) {
  res.send('<ul>' +
    '<li>Download <a href="/files/notes/groceries.txt">notes/groceries.txt</a>.</li>' +
    '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>' +
    '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>' +
    '</ul>')
});

// Wildcard route for file downloads
app.get('/files/*file', function(req, res, next) {
  res.download(req.params.file.join('/'), { root: FILES_DIR }, function(err) {
    if (!err) return; // File sent successfully
    if (err.status !== 404) return next(err); // Non-404 error
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
});

app.listen(3000);
console.log('Express started on port 3000');
```

## res.locals - Template Local Variables

Use `res.locals` to pass variables to templates. Variables set on `res.locals` are available within a single request-response cycle.

```javascript
'use strict'

var express = require('express');
var path = require('node:path');
var session = require('express-session');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Define custom response method
app.response.message = function(msg) {
  var sess = this.req.session;
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'some secret here'
}));

app.use(express.urlencoded({ extended: true }))

// Middleware to expose messages to views via res.locals
app.use(function(req, res, next) {
  var msgs = req.session.messages || [];

  // Expose "messages" local variable
  res.locals.messages = msgs;

  // Expose "hasMessages"
  res.locals.hasMessages = !!msgs.length;

  next();
  // Flush messages after response
  req.session.messages = [];
});

// Error handler
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('5xx');
});

// 404 handler
app.use(function(req, res, next) {
  res.status(404).render('404', { url: req.originalUrl });
});

app.listen(3000);
console.log('Express started on port 3000');
```

## Virtual Hosts with vhost Middleware

Use the `vhost` middleware to handle requests for different hostnames on the same server.

```javascript
'use strict'

var express = require('express');
var vhost = require('vhost');

// Main server app
var main = express();

main.get('/', function(req, res) {
  res.send('Hello from main app!');
});

main.get('/:sub', function(req, res) {
  res.send('requested ' + req.params.sub);
});

// Redirect app for subdomains
var redirect = express();

redirect.use(function(req, res) {
  console.log(req.vhost);
  res.redirect('http://example.com:3000/' + req.vhost[0]);
});

// Vhost app
var app = express();

app.use(vhost('*.example.com', redirect)); // Subdomains
app.use(vhost('example.com', main));       // Main domain

// Edit /etc/hosts:
// 127.0.0.1       foo.example.com
// 127.0.0.1       bar.example.com
// 127.0.0.1       example.com

app.listen(3000);
console.log('Express started on port 3000');
```

## Authentication Pattern

Implement authentication using sessions, middleware for access control, and password hashing.

```javascript
'use strict'

var express = require('express');
var hash = require('pbkdf2-password')()
var path = require('node:path');
var session = require('express-session');
var app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded())
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

// Flash message middleware
app.use(function(req, res, next) {
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="msg error">' + err + '</p>';
  if (msg) res.locals.message = '<p class="msg success">' + msg + '</p>';
  next();
});

// User database
var users = { tj: { name: 'tj' } };

// Hash password on startup
hash({ password: 'foobar' }, function(err, pass, salt, hash) {
  if (err) throw err;
  users.tj.salt = salt;
  users.tj.hash = hash;
});

// Authenticate user
function authenticate(name, pass, fn) {
  var user = users[name];
  if (!user) return fn(null, null)
  hash({ password: pass, salt: user.salt }, function(err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

// Restrict middleware
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', function(req, res) {
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res) {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res) {
  req.session.destroy(function() {
    res.redirect('/');
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res, next) {
  if (!req.body) return res.sendStatus(400)
  authenticate(req.body.username, req.body.password, function(err, user) {
    if (err) return next(err)
    if (user) {
      req.session.regenerate(function() {
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name;
        res.redirect(req.get('Referrer') || '/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your username and password.';
      res.redirect('/login');
    }
  });
});

app.listen(3000);
console.log('Express started on port 3000');
```

## Summary

Express.js is the most popular Node.js web framework, designed for building web applications and REST APIs. Its core use cases include creating single-page applications with server-side rendering, building RESTful APIs with JSON responses, serving static files and assets, implementing user authentication and session management, and creating middleware-based request processing pipelines. Express integrates seamlessly with databases through any Node.js driver, supports all major template engines, and can be extended with thousands of npm middleware packages.

The framework follows a middleware-based architecture where request processing flows through a stack of functions. Common integration patterns include mounting multiple routers for API versioning, using error-handling middleware for centralized error management, implementing authentication middleware for protected routes, and combining Express with WebSocket libraries for real-time features. Express's minimal core and extensive middleware ecosystem make it suitable for projects ranging from simple APIs to complex enterprise applications.
