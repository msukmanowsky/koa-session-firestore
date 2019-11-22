import { Firestore } from "@google-cloud/firestore";
export interface StoreOptions {
    db: Firestore;
    collectionName?: string;
}
export declare class FirestoreStore {
    db: Firestore;
    collectionName: string;
    constructor(options: StoreOptions);
    set(sessionId: string, data: any): Promise<void>;
    get(sessionId: string, ttl?: number): Promise<any>;
    destroy(sessionId: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map