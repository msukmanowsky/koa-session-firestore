"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = __importDefault(require("debug"));
const debug = debug_1.default("koa-session-firestore");
class FirestoreStore {
    constructor(options) {
        this.db = options.db;
        if (!this.db) {
            throw new Error("No Firestore client passed to Firestore Session");
        }
        this.collectionName = options.collectionName || "sessions";
    }
    set(sessionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const serialized = JSON.stringify(data);
            yield this.db
                .collection(this.collectionName)
                .doc(sessionId)
                .set({
                updatedAt: new Date(),
                data: serialized
            });
        });
    }
    get(sessionId, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield this.db
                .collection(this.collectionName)
                .doc(sessionId)
                .get();
            if (!snapshot.exists) {
                debug(`no session found for ${sessionId}`);
                return;
            }
            if (typeof ttl === "number") {
                const updatedAt = snapshot.data().updatedAt.toMillis();
                if (Date.now() - updatedAt >= ttl) {
                    debug(`session ${sessionId} has outlived it's time to live, destroying`);
                    yield snapshot.ref.delete();
                    return;
                }
                ;
            }
            const data = JSON.parse(snapshot.data().data);
            return data;
        });
    }
    destroy(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.db
                .collection(this.collectionName)
                .doc(sessionId)
                .delete();
        });
    }
}
exports.FirestoreStore = FirestoreStore;
