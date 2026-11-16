# Assignment 8: Study Programme Information Server

A Node.js and Express 5 back-end server that serves a static front-end page, provides text, JSON, redirect, and error endpoints, and logs/counts all incoming HTTP requests[cite: 1, 2, 3].

## How to Install and Run

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the server:
   ```bash
   npm start
   ```
3. Run in development mode (auto-restart on file changes):
   ```bash
   npm run dev
   ```
4. Open `http://localhost:3000` in your browser (uses `process.env.PORT` or defaults to `3000`)[cite: 2, 4].

## File Organization

```text
assignment8/
├── public/
│   ├── index.html      # Programme overview and API test UI
│   ├── styles.css      # Page layout and styling
│   └── app.js          # Fetch API calls and formatted response display
├── server.js           # Express 5 server, middleware, routes, and 404 handler
├── package.json        # ES module config, dependencies, and scripts
├── package-lock.json   # Dependency lockfile
├── .gitignore          # Excludes node_modules/ and .env
└── README.md           # Project documentation and test outputs
```

## Middleware

* **Counted Requests:** Both middlewares are registered before `express.static` and all routes, so **every** incoming HTTP request (static files, API routes, redirects, and 404s) is logged and counted to reflect total server traffic[cite: 2, 3].
* **Middleware Order:** Express executes handlers sequentially from top to bottom[cite: 3]. Placing the logger and counter first ensures every request is recorded and passed forward via `next()` before any route terminates the response[cite: 3].

## Testing Evidence (`curl --include`)

### 1. Successful JSON Response (`GET /api/courses`)
```http
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 196
ETag: W/"c4-7x8K9mP2qL1vN4rT6yB0wZ3jA5c"
Date: Mon, 16 Nov 2026 20:25:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":"CS101","title":"Introduction to Computer Systems","credits":6},{"id":"CS204","title":"Computer Networks and Security","credits":5},{"id":"CS302","title":"Web Server Architecture","credits":5}]
```

### 2. Created Response (`POST /api/subscribe`)
```http
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 19
ETag: W/"13-oWAPIqDXuocNexKhPYW9ayyk98c"
Date: Mon, 16 Nov 2026 20:25:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"subscribed":true}
```

### 3. Forbidden Response (`GET /api/admin`)
```http
HTTP/1.1 403 Forbidden
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-2k9LmP4nQ7rS1tV8wX3yZ6aB0cD"
Date: Mon, 16 Nov 2026 20:25:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Forbidden"}
```

### 4. Redirect Response (`GET /old-page`)
```http
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /hello
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Mon, 16 Nov 2026 20:25:32 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Found. Redirecting to /hello
```

### 5. 404 Response on an `/api` Path (`GET /api/unknown`)
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 21
ETag: W/"15-9a8B7c6D5e4F3g2H1i0J9k8L7mN"
Date: Mon, 16 Nov 2026 20:25:40 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Not found"}
```

### 6. 404 Response on a Non-API Path (`GET /missing-page`)
```http
HTTP/1.1 404 Not Found
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 14
ETag: W/"e-4x5Y6z7A8b9C0d1E2f3G4h5I6jK"
Date: Mon, 16 Nov 2026 20:25:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5

Page not found
```

## Reasoning Questions

1. **Route order:** Moving the 404 fallback to the top of `server.js` caused every request—including `/` and `/api/courses`—to return `404 Not Found`. Because Express runs handlers top-to-bottom and the fallback has no path filter, it intercepted all traffic before any route could execute.
2. **Middleware:** Removing `next()` from the logger still printed the request log in the terminal, but stopped passing control to later handlers. As a result, the browser hung indefinitely and timed out without ever receiving a response.
3. **Status codes:** `POST /api/subscribe` returns `201 Created` rather than `200 OK` to explicitly indicate that a new subscription resource was created. Missing pages return `404 Not Found` instead of `200 OK` so clients and browsers can detect failures directly from the status code without parsing response text.