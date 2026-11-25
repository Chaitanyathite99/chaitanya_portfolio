# Chaitanya Thite — playful portfolio

A responsive personal portfolio with a dependency-free Python API and a Node.js
frontend server. The contact form is a demo: it validates a message but does not
store or email it.

## Run locally

Requires Python 3 and Node.js 18 or newer. No packages need to be installed.
Open two terminals in this folder:

```sh
npm run api
```

```sh
npm start
```

Visit <http://127.0.0.1:5173>. The Node.js server serves the frontend and
forwards `/api` requests to the Python API on `127.0.0.1:8000`.

## API

- `GET /api/health` — API health check.
- `GET /api/profile` — portfolio profile details.
- `POST /api/contact` — validates a demo contact message; it is not retained.

Set `PORT` to change the frontend server port. The Python API currently uses
port `8000`.

# chaitanya_portfolio
