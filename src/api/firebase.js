import {
  collection,
  query,
  where,
  getDoc,
  getDocs,
  orderBy,
  limit,
  doc,
  addDoc,
  deleteDoc,
  updateDoc as updateDocument,
} from 'firebase/firestore';
import { auth, db } from '../constants/FirebaseConfig';

import { navigate } from '../navigationRef';

export const get = async (col) => {
  console.log(`[Firebase - get] collection: ${collection}`);
  const data = [];
  try {
    const querySnapshot = await getDocs(collection(db, col));
    querySnapshot.forEach((document) => {
      data.push({ id: document.id, ...document.data() });
    });
  } catch (error) {
    console.error('Error getting document: ', error);
  }
  return data;
};

export const getOrderingBy = async (col, field, direction = 'asc') => {
  // console.log(`[Firebase - getOrderingBy] collection: ${collection}`);
  const data = [];
  try {
    const colRef = collection(db, col);
    const querySnapshot = await getDocs(
      query(colRef, orderBy(field, direction))
    );
    querySnapshot.forEach((documentRead) => {
      data.push({ id: documentRead.id, ...documentRead.data() });
    });
  } catch (error) {
    console.error('Error while fetching data (getOrderingBy)', error);
  }
  // console.log(`[Firebase - getOrderingBy] collection: ${collection} ${data}`);

  return data;
};

export const getByAttribute = async (col, attribute, value) => {
  console.log(
    `[Firebase - getByAttribute] collection: ${col}; attribute: ${attribute}; value: ${value}`
  );

  const ref = collection(db, col);
  const data = [];
  try {
    const q = query(ref, where(attribute, '==', value));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.error('Error getting document: ', error);
  }
  return data;
};

export const getByAttributeOrderingBy = async (
  col,
  attribute,
  value,
  orderBy
) => {
  // console.log(
  //   `[Firebase - getByAttribute] collection: ${collection}; attribute: ${attribute}; value: ${value}; orderBy: ${orderBy}`
  // );
  const ref = collection(db, col);
  const data = [];
  try {
    const q = query(ref, where(attribute, '==', value));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    // console.log('[Firebase util] users', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error getting document: ', error);
  }
  return data;
};

export const getById = async (collectionName, id) => {
  console.log(`[Firebase - getById] collection: ${collectionName}; id: ${id}`);

  let data = null;

  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    data = { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    console.error('Error while getting by id.', error);
  }
  return data;
};

export const getFirst = async (col) => {
  // console.log(`[Firebase - findFirstData] collection: ${collection}`);
  const data = [];

  try {
    const colRef = collection(db, col);

    const querySnapshot = await getDocs(colRef, limit(1));

    querySnapshot.forEach((document) => {
      data.push({ id: document.id, ...document.data() });
    });
  } catch (error) {
    console.error('Error while getting data by attribute: ', error);
  }
  return data.length > 0 ? data[0] : null;
};

export const getFirstByAttribute = async (collection, attribute, value) => {
  console.log('[Firebase - getFirstByAttribute] ...');

  const docs = await getByAttribute(collection, attribute, value);

  return docs.length ? docs.shift() : null;
};

export const getGroupDeliveries = async (col, document, subcol) => {
  console.log(
    `[Firebase - getGroupDeliveries] collection: ${col}; doc: ${document}; subcollection: ${subcol}`
  );

  const data = [];
  try {
    const colRef = collection(db, col, document, subcol);
    const querySnapshot = await getDocs(
      query(colRef, limit(8), orderBy('date', 'desc'))
    );
    querySnapshot.forEach((documentRead) => {
      data.push({
        id: documentRead.id,
        deliveryDate: documentRead.data().date.toDate(),
        limitDate: documentRead.data().ordersLimitDate.toDate(),
        ...documentRead.data(),
      });
    });
  } catch (error) {
    console.error('Error getting document: ', error);
  }
  // console.log(
  //   `[Firebase - getGroupDeliveries] collection: `,
  //   JSON.stringify(data, null, 2)
  // );
  return data;
};

export const getByIdFromSubcollection = async (
  collectionName,
  collectionId,
  subCollectionName,
  subCollectionId
) => {
  console.log(
    `[Firebase - getByIdFromSubcollection] collection: ${collectionName}; doc: ${collectionId}; subcollection: ${subCollectionName}; subDoc: ${subCollectionId}`
  );

  let data = null;

  try {
    const docRef = doc(
      db,
      collectionName,
      collectionId,
      subCollectionName,
      subCollectionId
    );
    const docSnap = await getDoc(docRef);
    data = {
      id: docSnap.id,
      deliveryDate: docSnap.data().date.toDate(),
      limitDate: docSnap.data().ordersLimitDate.toDate(),
      ...docSnap.data(),
    };
  } catch (error) {
    console.error('Error getting document: ', error);
  }
  return data;
};

// This function should be merged with the above function in the future
export const getByIdFromSubcollectionPayments = async (
  collectionName,
  collectionId,
  subcollection,
  subcollectionId
) => {
  // console.log(
  //   `[Firebase - getByIdFromSubcollection] collection: ${collection}; doc: ${collectionId}; subcollection: ${subcollection}; subDoc: ${subcollectionId}`
  // );

  let data = null;

  const ref = db.collection(collectionName);
  await ref
    .doc(collectionId)
    .collection(subcollection)
    .doc(subcollectionId)
    .get()
    .then((document) => {
      data = {
        ...document.data(),
      };
    })
    .catch((err) =>
      console.log('Error while getting by id from subcollection', err)
    );

  return data;
};

export const insertDoc = async (collectionName, data) => {
  console.log(
    `[Firebase - insertDoc] collection: ${collectionName}; data: ${JSON.stringify(
      data
    )}`
  );

  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef;
  } catch (err) {
    console.log('Error while adding data.', err);
    if (err.code === 'permission-denied') {
      navigate('SigninScreen');
    }
  }
};

export const insertDocAndRetrieveId = async (collectionName, data) => {
  console.log(
    `[Firebase - insertDocAndRetrieveId] collection: ${collectionName}; data: ${JSON.stringify(
      data
    )}`
  );

  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id;
  } catch (err) {
    console.log('Error while adding data.', err);
    if (err.code === 'permission-denied') {
      navigate('SigninScreen');
    }
  }
};

export const insertIntoSubcollection = async (col, document, subCol, data) => {
  // console.log(
  //   `[Firebase - insertIntoSubcollection] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}`
  // );
  let docRefId = null;
  try {
    const ref = collection(db, col, document, subCol);
    const docRef = await addDoc(ref, data);
    console.log('[Firebase api] inserIntoSubcollection return', docRef.id);
    docRefId = docRef.id;
  } catch (error) {
    console.log('Error while inserting doc into subcollection', error);
  }
  return docRefId;
};

export const updateDocInSubcollection = async (
  collectionName,
  documentId,
  subCollectionName,
  subCollectionDocumentId,
  data
) => {
  console.log(
    `[Firebase - updateDocInSubcollection] collection: ${collectionName}; doc: ${documentId}; subcollection: ${subCollectionName}; subcollection doc: ${subCollectionDocumentId}`
  );
  try {
    const subColRef = doc(
      db,
      collectionName,
      documentId,
      subCollectionName,
      subCollectionDocumentId
    );
    const docRef = updateDocument(subColRef, data);
    console.log(docRef);
  } catch (error) {
    console.log('Error while updating doc in subcollection', error);
  }
};

export const updateDocAttribute = async (col, docId, attribute, value) => {
  // console.log(
  //   `[Firebase - updateDocAttribute] collection: ${col}; doc: ${doc}; attribute: ${attribute}; value: ${value}`
  // );

  try {
    console.log('===== Entrei');
    const docRef = doc(db, col, docId);
    await updateDocument(docRef, { [attribute]: value });
    console.log('Document attribute successfully updated!');
  } catch (error) {
    console.error(`Error updating document: ${docId}`, error);
    if (error.code === 'permission-denied') {
      navigate('SigninScreen');
    }
    throw error;
  }
};

export const updateDoc = async (col, docId, data) => {
  try {
    const ref = doc(db, col, docId);

    const docRef = updateDocument(ref, data);
    console.log(docRef);
  } catch (error) {
    console.log('Error while updating doc in subcollection', error);
  }
};

export const deleteDocument = async (collectionName, documentId) => {
  console.log(
    `[Firebase - deleteDoc] collection: ${collectionName}; doc: ${documentId}`
  );

  try {
    await deleteDoc(doc(db, collectionName, documentId));
    console.log(`Document ${doc} deleted successfully.`);
  } catch (err) {
    console.log(`Error deleting document ${doc}:`, err);
    throw err; // Re-throw the error to handle it outside this function if needed.
  }
};

export const deleteDocInSubcollection = async (
  collectionName,
  document,
  subCollectionName,
  subcollectionDoc
) => {
  // console.log(
  //   `[Firebase - deleteDocInSubcollection] collection: ${collection}; doc: ${doc}; subcollection: ${subcollection}; doc: ${subcollectionDoc}`
  // );

  const ref = db.collection(collectionName);

  await ref
    .doc(document)
    .collection(subCollectionName)
    .doc(subcollectionDoc)
    .delete()
    .catch((err) => {
      console.log(`Error deleting document in subcollection: ${doc}`, err);
      navigate('SigninScreen');
    });
};

export const resetPassword = (email) => {
  return auth().sendPasswordResetEmail(email);
};

export const fetchPayments = async (
  collectionName,
  subCollectionName,
  documentId
) => {
  console.log(
    `[Firebase - fetchPayments] collection: ${collectionName}; doc: ${documentId}; subcollection: ${subCollectionName};`
  );
  const userPayments = [];
  const colRef = collection(db, collectionName, documentId, subCollectionName);
  try {
    const querySnapshot = await getDocs(query(colRef));
    querySnapshot.forEach((payment) => {
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
  } catch (error) {
    console.log('Erro ao carregar os pagamentos!', error);
    return error;
  }

  return userPayments;
};
