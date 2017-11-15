// console.log('Descructuring');
//
// const person = {
//   name: 'Julio',
//   age: 23,
//   location: {
//     city: 'Mexicali',
//     temp: 120
//   }
// };
//
// const {name: fistName = 'Anonymous', age, location} = person;
// const {city, temp} = location;
//
// console.log(`${fistName} is ${age}. He lives in ${city}, currently is ${temp}`);

// const book = {
//   title: 'Ego is the Enemy',
//   author: 'Ryan Holiday',
//   publisher: {
//     name: 'Penguin'
//   }
// };
//
// const {name: publisherName = 'Self-publisher'} = book.publisher;
//
// console.log(publisherName);

const item = ['Coffee (hot)', '$2.00', '$2.50', '$2.75'];

const [name, ,mprice] = item;

console.log(`A medium ${name} costs ${mprice}`);


































// console.log(publisherName);
