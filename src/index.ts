import { Firestore } from "@google-cloud/firestore";
import Debug from "debug";

const debug = Debug("koa-session-firestore");

export interface StoreOptions {
  db: Firestore;
  collectionName?: string;
}

export class FirestoreStore {
  db: Firestore;
  collectionName: string;

  constructor(options: StoreOptions) {
    this.db = options.db;
    if (!this.db) {
      throw new Error("No Firestore client passed to Firestore Session");
    }
    this.collectionName = options.collectionName || "sessions";
  }

  async set(sessionId: string, data: any) {
    const serialized = JSON.stringify(data);
    await this.db
      .collection(this.collectionName)
      .doc(sessionId)
      .set({
        updatedAt: new Date(),
        data: serialized
      });
  }

  async get(sessionId: string, ttl?: number) {
    const snapshot = await this.db
      .collection(this.collectionName)
      .doc(sessionId)
      .get();

    if (!snapshot.exists) {
      debug(`no session found for ${sessionId}`);
      return;
    }

    if (typeof ttl === "number") {
      const updatedAt = snapshot.data()!.updatedAt.toMillis();
      if (Date.now() - updatedAt >= ttl) {
        debug(
          `session ${sessionId} has outlived it's time to live, destroying`
        );
        await snapshot.ref.delete();
        return;
      }
    }

    const data = JSON.parse(snapshot.data()!.data);
    return data;
  }

  async destroy(sessionId: string) {
    await this.db
      .collection(this.collectionName)
      .doc(sessionId)
      .delete();
  }
}
