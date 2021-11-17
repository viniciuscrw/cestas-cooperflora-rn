// import { users } from './InitialUsers';
const { users, extraProducts } = require('./InitialData');

const admin = require('firebase-admin');
// const { users } = require('./InitialUsers.js');

const group = {
  address:
    'STOUT Café Cultura & Bar - R. Gilberto Pattaro, 105 - Barão Geraldo, Campinas - SP',
  baseProductsPrice: 35,
  deliveryFee: 5,
  deliveryFrequencyInDays: 15,
  deliveryFrequencyText: 'Quinzenalmente às quartas-feiras',
  deliveryWeekDay: 'Quarta-feira',
  name: 'Barão Geraldo',
  time: 'Das 18h30 às 19h00',
};

console.log(users);

// Prod DB
// const serviceAccount = require('../../cestascooperflorabarao-firebase-adminsdk-kg42n-264249460c.json');

// Dev DB
// const serviceAccount = require('../../cestascooperflorabarao-dev-firebase-adminsdk-hopm6-3604f3476c.json');
// const databaseURL = 'https://cestascooperflorabarao-dev-default-rtdb.asia-southeast1.firebasedatabase.app';

// Bordi database ==============
const serviceAccount = require('../../cestas-cooperflora-dev2-firebase-adminsdk-f8nor-6bf231082b.json');

const databaseURL =
  'https://cestas-cooperflora-dev2-default-rtdb.firebaseio.com';
// =============================

console.log('Iniciando a criação do banco de dados do app Cestas Cooperflora');

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

console.log('Criação dos usuários de inicialização do app.');
users.map((user) => {
  db.firestore()
    .collection('users')
    .add(user)
    .then((docRef) => {
      console.log('Usuário criado com sucesso: ', user);
      console.log('ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Erro ao incluir o usuário: ', error);
    });
});

console.log('Criação do grupo de consumo');
db.firestore()
  .collection('groups')
  .add(group)
  .then((docRef) => {
    console.log('Organizador(a) criado com sucesso: admin@admin.com');
    console.log('ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Erro ao incluir o usuário: ', error);
  });

console.log('Inclusão dos produtos extras no banco de dados.');
console.log(extraProducts);
extraProducts.map((extraProduct) => {
  extraProduct.availableQuantity = null;
  extraProduct.maxOrderQuantity = null;
  console.log(extraProduct);
  db.firestore()
    .collection('products')
    .add(extraProduct)
    .then((docRef) => {
      console.log('Produto criado com sucesso: ', extraProduct);
      console.log('ID: ', docRef.id);
    })
    .catch((error) => {
      console.error('Erro ao incluir o produto: ', error);
    });
});

// db.firestore()
//   .collection('groups')
//   .get()
//   .then((docs) => {
//     docs.forEach((doc) => {
//       console.log(doc.data());
//     });
//   });

console.log('Criação do banco de dados com sucesso.');
