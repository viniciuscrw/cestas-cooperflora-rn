const admin = require('firebase-admin');

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

const user = {
  email: 'cooperflorabarao@gmail.com',
  name: 'Organizador',
  role: 'organizer',
};

// Prod DB
// const serviceAccount = require('../../cestascooperflorabarao-firebase-adminsdk-kg42n-264249460c.json');

//Dev DB
const serviceAccount = require('../../cestascooperflorabarao-dev-firebase-adminsdk-hopm6-3604f3476c.json');



console.log('Iniciando banco de dados do app Cestas Cooperflora');
console.log(group);

const db = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cestascooperflorabarao-default-rtdb.firebaseio.com',
});

console.log('Criação do usuário de inicialização do app.');
db.firestore()
  .collection('users')
  .add(user)
  .then((docRef) => {
    console.log('Organizador(a) criado com sucesso: ', user);
    console.log('ID: ', docRef.id);
  })
  .catch((error) => {
    console.error('Erro ao incluir o usuário: ', error);
  });

console.log('Ciração do grupo de consumo');
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

// db.firestore()
//   .collection('groups')
//   .get()
//   .then((docs) => {
//     docs.forEach((doc) => {
//       console.log(doc.data());
//     });
//   });
