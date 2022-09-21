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

for (let i = 0; i < 10000; i++) {
   console.log(i);
}