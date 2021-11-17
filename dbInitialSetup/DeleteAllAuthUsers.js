let admin = require('firebase-admin');
let readline = require('readline');

let read = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Bordi database
const serviceAccount = require('../../cestas-cooperflora-dev2-firebase-adminsdk-f8nor-6bf231082b.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://cestas-cooperflora-dev2-default-rtdb.firebaseio.com',
});

function deleteUser(user) {
  admin
    .auth()
    .deleteUser(user.uid)
    .then(() => {
      console.log('Usuário apagado com sucesso.', user.uid, user.email);
    })
    .catch((error) => {
      console.log('Erro ao apagar o usuários', error);
    });
}

const users = [];
let user;

const getAllUsers = async (nextPageToken) => {
  admin
    .auth()
    .listUsers(100, nextPageToken)
    .then((listUsersResult) => {
      listUsersResult.users.forEach((userRecord) => {
        user = userRecord.toJSON();
        users.push(user);
        deleteUser(user);

        // read.question(
        //   'Os usuários acima serão excluídos do Firebase. Você confirma essa ação? (sim/não)\n',
        //   (answer) => {
        //     const response = answer;
        //     console.log(
        //       `\nSua resposta '${response}' foi grava com sucesso numa variável inútil`
        //     );
        //     read.close();
        //     if (response === 'sim') {
        //       deleteUser(user);
        //     }
        //   }
        // );
      });

      if (listUsersResult.pageToken) {
        getAllUsers(listUsersResult.pageToken);
      }
    })
    .catch((error) => {
      console.log('Error listing users:', error);
    });
};

getAllUsers();
