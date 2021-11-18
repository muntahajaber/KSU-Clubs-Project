// import * as firebase from 'firebase';
// import '@firebase/auth';
// import '@firebase/firestore';

// const firebaseConfig = {
//   apiKey: 'AIzaSyCXMQ1aC9RjFVRLF8Hwx7E4Nn6hDkZ2_-Y', // done
//   authDomain: 'ksuclubs-28609.firebaseapp.com', //done
//   databaseURL: 'https://ksuclubs-28609.firebaseio.com',//done
//   projectId: 'ksuclubs-28609', //done
//   storageBucket: 'ksuclubs-28609.appspot.com', //done
//   messagingSenderId: '813434469957', //done
//   appId: 'i1:813434469957:ios:e0dad1b5e4e85b0c112d2c', //done
// };

// if (!firebase.apps.length) {
//     firebase.initializeApp(firebaseConfig);
// }

// export { firebase };

// database/firebaseDb.js

import * as firebase from 'firebase';

const firebaseConfig = {
 apiKey: 'AIzaSyCXMQ1aC9RjFVRLF8Hwx7E4Nn6hDkZ2_-Y', // done
  authDomain: 'ksuclubs-28609.firebaseapp.com', //done
  databaseURL: 'https://ksuclubs-28609.firebaseio.com',//done
  projectId: 'ksuclubs-28609', //done
  storageBucket: 'ksuclubs-28609.appspot.com', //done
  messagingSenderId: '813434469957', //done
  appId: 'i1:813434469957:ios:e0dad1b5e4e85b0c112d2c', //done
};


firebase.initializeApp(firebaseConfig);

export default firebase;