import { db } from "../auth/src/config/firebase.js";

export const addSubscriber = async (email) => {
  return db.collection("Subscribers").add({
    email,
    createdAt: new Date(),
  });
};

export const getSubscribers = async () => {
  const snapshot = await db.collection("Subscribers").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
