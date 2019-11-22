const Koa = require("koa");
const Router = require("@koa/router");
const session = require("koa-session");
const firebaseAdmin = require('firebase-admin');
const { FirestoreStore } = require("koa-session-firestore");

const FIREBASE_CONFIG = require("./firebase.config.json");

firebaseAdmin.initializeApp({
  ...FIREBASE_CONFIG,
  credential: firebaseAdmin.credential.applicationDefault(),
});
const firestore = firebaseAdmin.firestore();

const app = new Koa();

app.keys = ["some super secret key"];
app.use(session(app, { store: new FirestoreStore({ db: firestore }) }));

const router = new Router();

router.get("/set/:value", async ctx => {
  ctx.session.key = ctx.params.value;
  ctx.body = `set value to : ${ctx.params.value}`;
});

router.get("/", async ctx => {
  ctx.body = `value is: ${ctx.session.key}`;
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = parseInt(process.env.PORT || "3000", 10);
app.listen(port);
console.info(`Server listening at http://localhost:${port}/`);
