import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  type WhereFilterOp,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getDocument<T>(
  collectionName: string,
  docId: string,
): Promise<T | null> {
  const snap = await getDoc(doc(db, collectionName, docId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function setDocument(
  collectionName: string,
  docId: string,
  data: Record<string, unknown>,
): Promise<void> {
  await setDoc(doc(db, collectionName, docId), data, { merge: true });
}

export async function deleteDocument(
  collectionName: string,
  docId: string,
): Promise<void> {
  await deleteDoc(doc(db, collectionName, docId));
}

export async function queryDocuments<T>(
  collectionName: string,
  options?: {
    orderByField?: string;
    orderDirection?: "asc" | "desc";
    limitCount?: number;
    whereClause?: { field: string; op: WhereFilterOp; value: unknown };
  },
): Promise<T[]> {
  const constraints = [];

  if (options?.whereClause) {
    const { field, op, value } = options.whereClause;
    constraints.push(where(field, op, value));
  }

  if (options?.orderByField) {
    constraints.push(
      orderBy(options.orderByField, options.orderDirection ?? "desc"),
    );
  }

  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}
