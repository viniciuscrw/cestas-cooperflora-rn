import firebase from 'firebase';
import 'firebase/firestore';
import { navigate } from '../navigationRef';

export const get = async (collection) => {
  console.log(`[Firebase - get] collection: ${collection}`);

  const db = firebase.firestore();
  const ref = db.collection(collection);
  const data = [];

  await ref
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((err) => console.log('Error while fetching data (get)', err));

  return data;
};

export const getOrderingBy = async (collection, field, direction = 'asc') => {
  console.log(`[Firebase - getOrderingBy] collection: ${collection}`);

  const db = firebase.firestore();
  const ref = db.collection(collection);
  const data = [];

  await ref
    .orderBy(field, direction)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((err) =>
      console.log('Error while fetching data (getOrderingBy)', err)
    );

  return data;
};

export const getByAttribute = async (collection, attribute, value) => {
  console.log(
    `[Firebase - getByAttribute] collection: ${collection}; attribute: ${attribute}; value: ${value}`
  );

  const db = firebase.firestore();
  const ref = db.collection(collection);
  const data = [];

  await ref
    .where(attribute, '==', value)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((err) => console.log('Error while getting data by attribute', err));

  return data;
};

export const getByAttributeOrderingBy = async (
  collection,
  attribute,
  value,
  orderBy
) => {
  console.log(
    `[Firebase - getByAttribute] collection: ${collection}; attribute: ${attribute}; value: ${value}; orderBy: ${orderBy}`
  );

  const db = firebase.firestore();
  const ref = db.collection(collection);
  const data = [];

  await ref
    .where(attribute, '==', value)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((err) => console.log('Error while getting data by attribute', err));

  return data;
};

export const getById = async (collection, id) => {
  console.log(`[Firebase - getById] collection: ${collection}; id: ${id}`);

  const db = firebase.firestore();
  const ref = db.collection(collection);
  let data = null;

  await ref
    .doc(id)
    .get()
    .then((doc) => {
      data = { id: doc.id, ...doc.data() };
    })
    .catch((err) => console.log('Error while getting by id.', err));

  return data;
};

export const getFirst = async (collection) => {
  console.log(`[Firebase - findFirstData] collection: ${collection}`);
  const data = [];

  const db = firebase.firestore();
  const ref = db.collection(collection);
  await ref
    .limit(1)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((err) => console.log('Error while getting data by attribute', err));

  return data.length > 0 ? data[0] : null;
};

export const getFirstByAttribute = async (collection, attribute, value) => {
  console.log('[Firebase - getFirstByAttribute] ...');

  const docs = await getByAttribute(collection, attribute, value);

  return docs.length ? docs.shift() : null;
};

export const getGroupDeliveries = async (collection, doc, subcollection) => {
  console.log(
    `[Firebase - getGroupDeliveries] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}`
  );
  const data = [];

  const db = firebase.firestore();
  const ref = db.collection(collection);
  await ref
    .doc(doc)
    .collection(subcollection)
    .orderBy('date', 'desc')
    .get()
    .then((snapshot) => {
      snapshot.forEach((document) => {
        data.push({
          id: document.id,
          deliveryDate: document.data().date.toDate(),
          limitDate: document.data().ordersLimitDate.toDate(),
          ...document.data(),
        });
      });
    })
    .catch((err) =>
      console.log('Error while getting data from deliveries', err)
    );

  return data;
};

export const getByIdFromSubcollection = async (
  collection,
  collectionId,
  subcollection,
  subcollectionId
) => {
  console.log(
    `[Firebase - getByIdFromSubcollection] collection: ${collection}; doc: ${collectionId}; subcollection: ${subcollection}; subDoc: ${subcollectionId}`
  );

  let data = null;

  const db = firebase.firestore();
  const ref = db.collection(collection);
  await ref
    .doc(collectionId)
    .collection(subcollection)
    .doc(subcollectionId)
    .get()
    .then((doc) => {
      data = {
        id: doc.id,
        deliveryDate: doc.data().date.toDate(),
        limitDate: doc.data().ordersLimitDate.toDate(),
        ...doc.data(),
      };
    })
    .catch((err) =>
      console.log('Error while getting by id from subcollection', err)
    );

  return data;
};

// This function should be merged with the above function in the future
export const getByIdFromSubcollectionPayments = async (
  collection,
  collectionId,
  subcollection,
  subcollectionId
) => {
  console.log(
    `[Firebase - getByIdFromSubcollection] collection: ${collection}; doc: ${collectionId}; subcollection: ${subcollection}; subDoc: ${subcollectionId}`
  );

  let data = null;

  const db = firebase.firestore();
  const ref = db.collection(collection);
  await ref
    .doc(collectionId)
    .collection(subcollection)
    .doc(subcollectionId)
    .get()
    .then((doc) => {
      data = {
        ...doc.data(),
      };
    })
    .catch((err) =>
      console.log('Error while getting by id from subcollection', err)
    );

  return data;
};

export const insertDoc = async (collection, data) => {
  console.log(
    `[Firebase - insertDoc] collection: ${collection}; data: ${JSON.stringify(
      data
    )}`
  );

  const db = firebase.firestore();

  await db
    .collection(collection)
    .doc()
    .set(data)
    .catch((err) => {
      console.log('Error while adding data.', err);
      if (err.code === 'permission-denied') {
        navigate('SigninScreen');
      }
    });
};

export const insertDocAndRetrieveId = async (collection, data) => {
  console.log(
    `[Firebase - insertDocAndRetrieveId] collection: ${collection}; data: ${JSON.stringify(
      data
    )}`
  );

  let id = null;
  const db = firebase.firestore();

  await db
    .collection(collection)
    .add(data)
    .then((docRef) => {
      id = docRef.id;
    })
    .catch((err) => {
      console.log('Error while adding data.', err);
      if (err.code === 'permission-denied') {
        navigate('SigninScreen');
      }
    });

  return id;
};

export const insertIntoSubcollection = async (
  collection,
  doc,
  subcollection,
  data
) => {
  console.log(
    `[Firebase - insertIntoSubcollection] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}`
  );

  const db = firebase.firestore();
  const ref = db.collection(collection);
  let docRefId = null;
  await ref
    .doc(doc)
    .collection(subcollection)
    .add(data)
    .then((docRef) => {
      console.log('[Firebase api] inserIntoSubcollection return', docRef.id);
      docRefId = docRef.id;
    })
    .catch((err) =>
      console.log('Error while inserting doc into subcollection', err)
    );
  // return data;
  return docRefId;
};

export const updateDocInSubcollection = async (
  collection,
  doc,
  subcollection,
  subcollectionDoc,
  data
) => {
  console.log(
    `[Firebase - updateDocInSubcollection] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}; subcollection doc: ${subcollectionDoc}`
  );

  const db = firebase.firestore();
  const ref = db.collection(collection);
  await ref
    .doc(doc)
    .collection(subcollection)
    .doc(subcollectionDoc)
    .set(data)
    .catch((err) =>
      console.log('Error while updating doc in subcollection', err)
    );

  return data;
};

export const updateDocAttribute = async (collection, doc, attribute, value) => {
  console.log(
    `[Firebase - updateDocAttribute] collection: ${collection}; doc: ${doc}; attribute: ${attribute}; value: ${value}`
  );

  const db = firebase.firestore();

  await db
    .collection(collection)
    .doc(doc)
    .update(attribute, value)
    .catch((err) => {
      console.log(`Error updating document: ${doc}`, err);
      if (err.code === 'permission-denied') {
        navigate('SigninScreen');
      }
    });
};

export const updateDoc = async (collection, doc, data) => {
  console.log(
    `[Firebase - updateDoc] collection: ${collection}; doc: ${doc}; data: ${JSON.stringify(
      data
    )}`
  );

  const db = firebase.firestore();

  await db
    .collection(collection)
    .doc(doc)
    .update(data)
    .catch((err) => {
      console.log(`Error updating document: ${doc}`, err);
      if (err.code === 'permission-denied') {
        navigate('SigninScreen');
      }
    });
};

export const deleteDoc = async (collection, doc) => {
  console.log(`[Firebase - deleteDoc] collection: ${collection}; doc: ${doc}`);

  const db = firebase.firestore();

  await db
    .collection(collection)
    .doc(doc)
    .delete()
    .catch((err) => {
      console.log(`Error deleting document: ${doc}`, err);
      navigate('SigninScreen');
    });
};

export const deleteDocInSubcollection = async (
  collection,
  doc,
  subcollection,
  subcollectionDoc
) => {
  console.log(
    `[Firebase - deleteDocInSubcollection] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}; doc: ${subcollectionDoc}`
  );

  const db = firebase.firestore();
  const ref = db.collection(collection);

  await ref
    .doc(doc)
    .collection(subcollection)
    .doc(subcollectionDoc)
    .delete()
    .catch((err) => {
      console.log(`Error deleting document in subcollection: ${doc}`, err);
      navigate('SigninScreen');
    });
};

export const resetPassword = (email) => {
  return firebase.auth().sendPasswordResetEmail(email);
};

export const fetchPayments = async (collection, subcollection, doc) => {
  const db = firebase.firestore();
  const ref = db.collection(collection);
  const userPayments = [];
  await ref
    .doc(doc)
    .collection(subcollection)
    .orderBy('date')
    .get()
    .then((snapshot) => {
      snapshot.forEach((payment) => {
        const date = new Date(payment.data().date);
        userPayments.push({
          paymentId: payment.id,
          userId: payment.data().userId,
          currentBalance: payment.data().currentBalance,
          date,
          orderId: payment.data().orderId,
          orderTotalAmount: payment.data().orderTotalAmount,
          status: payment.data().status,
          totalToBePaid: payment.data().totalToBePaid,
          receipt: payment.data().receipt ? payment.data().receipt : {},
          showReceiptImage: false,
          paymentNote: payment.data().paymentNote,
        });
      });
      userPayments.sort((a, b) => {
        return a.date < b.date ? 1 : -1;
      });
    })
    .catch((err) => {
      console.log('Erro ao carregar os pagamentos!', err);
      return err;
      // Alert.alert('Erro ao carregar os seus pagamentos!', err);
    });
  return userPayments;
};
