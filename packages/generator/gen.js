import { annualReportSections, professions } from 'hypera-shared';

const randomNumberBetween = (min, max) => {
   return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = [];
const sections = annualReportSections.map(section => section.id);

const sectionRanges = Array.from(new Array(sections.length)).map(() => {
   const start = randomNumberBetween(1000, 1500);
   const end = randomNumberBetween(start + 100, start + 500);
   return [start, end]
});

for (let i = 0; i < 1; i++) {
   data.push({
      profession: professions[randomNumberBetween(0, professions.length - 1)].id,
      ...sections.map((section, i) => ({ [section]: randomNumberBetween(sectionRanges[i][0], sectionRanges[i][1]) }))
   });
}
console.log(sectionRanges, data)