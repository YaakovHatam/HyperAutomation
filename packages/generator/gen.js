import { EOL } from 'os';
import { annualReportSections, professions } from 'hypera-shared';
import { writeFileSync } from 'fs';
import { join } from 'path';

const storage = 'C:\\Users\\yaakov\\Documents\\GitHub\\hyperautomation\\data';

const randomNumberBetween = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = [];

const sectionRanges = Array.from(new Array(annualReportSections.length)).map(() => {
   const start = randomNumberBetween(1000, 1500);
   const end = randomNumberBetween(start + 100, start + 500);
   return [start, end]
});

const professionsIncomeRanges = Object.assign(...professions.map(profession => {
   const start = randomNumberBetween(120000, 250000);
   const end = randomNumberBetween(start + 120000, start + 120000);
   return { [profession.id]: [start, end] };
}));

for (let i = 0; i < 20000; i++) {
   const profession = professions[randomNumberBetween(0, professions.length - 1)].id;
   data.push({
      profession,
      income: randomNumberBetween(professionsIncomeRanges[profession][0], professionsIncomeRanges[profession][1]),
      ...Object.assign(...annualReportSections.map((section, i) =>
         ({ [section.name]: randomNumberBetween(sectionRanges[i][0], sectionRanges[i][1]) })))
   })
}
const fileText = Object.keys(data[0]).join(',') + EOL + data.map(d => Object.values(d).join(',')).join(EOL);
writeFileSync(join(storage, 'allData.csv'), fileText);
