# koa-session-firestore

A Firebase Firestore store for the Node [Koa Framework](https://koajs.com/).

Have a question? Feel free to book a slot to talk or [file an issue](https://github.com/msukmanowsky/koa-session-firestore/issues/new).

# Installation

```
npm i --save koa-session-firestore
```

# Basic Usage

See [example/server.js](example/server.js) for example usage.

# Options

```typescript
import { FirestoreStore } from "koa-session-firestore";

const store = new Firestore({
    // Firestore instance
    db: firebase.firestore(),
    // Optional: default is sessions
    collectionName: "something"
});
```
