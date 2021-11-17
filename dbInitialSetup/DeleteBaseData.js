// import { users } from './InitialUsers';
const { users } = require('./InitialUsers');

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

// Bordi database ==============
const serviceAccount = require('../../cestas-cooperflora-dev2-firebase-adminsdk-f8nor-6bf231082b.json');

const databaseURL =
  'https://cestas-cooperflora-dev2-default-rtdb.firebaseio.com';
// =============================

console.log(
  'Iniciando a configuração do banco de dados do app Cestas Cooperflora'
);
console.log(group);

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL,
});

// Drop Firestore users database
const deleteCollection = async (collection) => {
  db.firestore()
    .collection(collection)
    .listDocuments()
    .then((val) => {
      val.map((val) => {
        val.delete();
      });
    });

  // db.firestore()
  //   .collection(collection)
  //   .listDocuments()
  //   .then((val) => {
  //     val.delete();
  //   });
};

// db.firestore()
//   .collection('users')
//   .listDocuments()
//   .then((val) => {
//     val.map((val) => {
//       batch.delete(val);
//     });

//     batch.commit();
//   });

// console.log('Criação dos usuários de inicialização do app.');
// users.map((user) => {
//   db.firestore()
//     .collection('users')
//     .add(user)
//     .then((docRef) => {
//       console.log('Usuário criado com sucesso: ', user);
//       console.log('ID: ', docRef.id);
//     })
//     .catch((error) => {
//       console.error('Erro ao incluir o usuário: ', error);
//     });
// });

// db.firestore()
//   .collection('users')
//   .add(user)
//   .then((docRef) => {
//     console.log('Organizador(a) criado com sucesso: ', user);
//     console.log('ID: ', docRef.id);
//   })
//   .catch((error) => {
//     console.error('Erro ao incluir o usuário: ', error);
//   });

// console.log('Ciração do grupo de consumo');
// db.firestore()
//   .collection('groups')
//   .add(group)
//   .then((docRef) => {
//     console.log('Organizador(a) criado com sucesso: admin@admin.com');
//     console.log('ID: ', docRef.id);
//   })
//   .catch((error) => {
//     console.error('Erro ao incluir o usuário: ', error);
//   });

// db.firestore()
//   .collection('groups')
//   .get()
//   .then((docs) => {
//     docs.forEach((doc) => {
//       console.log(doc.data());
//     });
//   });

console.log('Apagando usuários !');

// const removeDbs = () => {
//   deleteCollection('users')
//     .then(() => {
//       console.log('Collection users apagada com sucesso !');
//       console.log('Inicio da remoção da collection orders');
//       deleteCollection('orders')
//         .then(() => {
//           console.log('Collection orders apagada com sucesso !');
//           console.log('Inicio da remoção da collection products');
//           deleteCollection('products')
//             .then(() => {
//               console.log('Collection products apagada com sucesso !');
//               console.log('Inicio da remoção da collection orders');
//               deleteCollection('groups')
//                 .then(() => {
//                   console.log('Collection groups apagada com sucesso !');
//                 })
//                 .catch(() => {
//                   console.log('Erro ao excluir groups collection');
//                 });
//             })
//             .catch(() => {
//               console.log('Erro ao excluir products collection');
//             });
//         })
//         .catch(() => {
//           console.log('Erro ao excluir orders collection');
//         });
//     })
//     .catch(() => {
//       console.log('Erro ao excluir user collection');
//     });
// };

console.log('Inicio da remoção das collections');

// console.log('Inicio da remoção da collection users');
// deleteCollection('users');
// console.log('Collection users apagada com sucesso !');
// console.log('Inicio da remoção da collection products');
// deleteCollection('products');
// console.log('Collection products apagada com sucesso !');
// console.log('Inicio da remoção da collection orders');
// deleteCollection('orders');
// console.log('Collection orders apagada com sucesso !');
// console.log('Inicio da remoção da collection groups');
// deleteCollection('groups');
// console.log('Collection groups apagada com sucesso !');
