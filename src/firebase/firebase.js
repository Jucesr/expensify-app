import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCtE3fsdro_QFtPP539-N4MpBe8N21of4s",
  authDomain: "expensify-e2139.firebaseapp.com",
  databaseURL: "https://expensify-e2139.firebaseio.com",
  projectId: "expensify-e2139",
  storageBucket: "expensify-e2139.appspot.com",
  messagingSenderId: "651061411468"
};

firebase.initializeApp(config);

firebase.database().ref().set({
  name: 'Julio',
  age: 23,
  isSingle: false,
  location: {
    city: 'Mexicali',
    country: 'Mexico'
  },
  attributes:{
    height: 1.8,
    weigth: 82
  }
});
