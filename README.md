# koa-session-firestore

A Firebase Firestore store for the Node [Koa Framework](https://koajs.com/).

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
