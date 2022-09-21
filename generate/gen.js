const headers = [
   'קניות',
   'נסיעות',
   'חניה',
   'דלק',
   'צרכי משרד',
   'כיבוד'
];
const Professions = [
   'מחשבים',
   'מכונות',
   'נגר',
   'מזון'
];

const randomNumberBetween = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = [];
for (let i = 0; i < 10000; i++) {
   data.push({
      profession: randomNumberBetween(0, Professions.length - 1),
      [headers[0]]: randomNumberBetween(1000, 1500),
      [headers[1]]: randomNumberBetween(200, 250),
      [headers[2]]: randomNumberBetween(400, 500),
      [headers[3]]: randomNumberBetween(200, 300),
      [headers[4]]: randomNumberBetween(100, 300),
      [headers[5]]: randomNumberBetween(0, 100)
   });
}