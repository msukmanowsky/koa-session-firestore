import * as firebase from "@firebase/testing";
import { FirestoreStore } from "./index";

const projectId = "koa-session-firestore";

function authedApp(auth?: object) {
  return firebase
    .initializeTestApp({ projectId, auth })
    .firestore();
}

function sleep(timeoutMs: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeoutMs);
  })
}

describe("basic tests", () => {
  let db: firebase.firestore.Firestore;

  beforeEach(() => {
    db = authedApp();
  });

  test("set, get and destroy work", async () => {
    // @ts-ignore
    const store = new FirestoreStore({ db });
    const data = { foo: "bar" };
    await store.set("test", data);
    expect(await store.get("test")).toEqual(data);
    await store.destroy("test");
    expect(await store.get("test")).toBeUndefined();
  });

  test("custom collection", async () => {
    // @ts-ignore
    const store = new FirestoreStore({ collectionName: "foo", db });
    const data = { foo: "bar" };
    await store.set("test", data);
    expect(await db.collection("foo").doc("test").get()).toBeTruthy();
    await store.destroy("test");
  });

  test("ttl works", async () => {
    // @ts-ignore
    const store = new FirestoreStore({ db });
    const data = { foo: "bar" };
    await store.set("test", data);
    const ttl = 250;
    await sleep(500);
    expect(await store.get("test", ttl)).toBeUndefined();
  })
});
