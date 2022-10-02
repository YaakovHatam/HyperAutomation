import { getFileContent } from "storage-conncetor";
import { EOL } from 'os';

const parseCsv = data => {
   /** @type string[] */
   const lines = data.split(EOL);

   const headers = lines.splice(0, 1)[0].split(',');

   const trainRows = Math.floor((lines.length) * 0.8);

   const train = lines.splice(0, trainRows);
   const trainFeatures = train.map(line => line.split(',').map(v => +v).slice(0, -1));
   const trainTarget = train.map(line => line.split(',').slice(-1)).map(v => [+v]);
   const testFeatures = lines.map(line => line.split(',').map(v => +v).slice(0, -1));
   const testTarget = lines.map(line => line.split(',').slice(-1)).map(v => [+v]);

   return [headers, trainFeatures, trainTarget, testFeatures, testTarget];
};

export class ReportsDataset {

   constructor() {

   }

   getFeatureDescriptions() {
      return this.featureDescriptions;
   }

   async loadData() {
      const csvFile = await getFileContent('data', 'allData.csv');

      [
         this.featureDescriptions,
         this.trainFeatures,
         this.trainTarget,
         this.testFeatures,
         this.testTarget] = parseCsv(csvFile);

      shuffle(this.trainFeatures, this.trainTarget);
      shuffle(this.testFeatures, this.testTarget);
   }

   get numFeatures() {
      // If numFeatures is accessed before the data is loaded, raise an error.
      if (this.trainFeatures == null) {
         throw new Error('\'loadData()\' must be called before numFeatures')
      }
      return this.trainFeatures[0].length;
   }

}

/**
 * Shuffles data and target (maintaining alignment) using Fisher-Yates
 * algorithm.flab
 */
function shuffle(data, target) {
   let counter = data.length;
   let temp = 0;
   let index = 0;
   while (counter > 0) {
      index = (Math.random() * counter) | 0;
      counter--;
      // data:
      temp = data[counter];
      data[counter] = data[index];
      data[index] = temp;
      // target:
      temp = target[counter];
      target[counter] = target[index];
      target[index] = temp;
   }
};