import * as tf from '@tensorflow/tfjs-node';

import { ReportsDataset, featureDescriptions } from './data.js';
import * as normalization from './normalization.js';

const NUM_EPOCHS = 200;
const BATCH_SIZE = 40;
const LEARNING_RATE = 0.01;

const reportsData = new ReportsDataset();
const tensors = {};

// Convert loaded data into tensors and creates normalized versions of the
// features.
export function arraysToTensors() {
   tensors.rawTrainFeatures = tf.tensor2d(reportsData.trainFeatures);
   tensors.trainTarget = tf.tensor2d(reportsData.trainTarget);
   tensors.rawTestFeatures = tf.tensor2d(reportsData.testFeatures);
   tensors.testTarget = tf.tensor2d(reportsData.testTarget);
   // Normalize mean and standard deviation of data.
   let { dataMean, dataStd } =
      normalization.determineMeanAndStddev(tensors.rawTrainFeatures);

   tensors.trainFeatures = normalization.normalizeTensor(
      tensors.rawTrainFeatures, dataMean, dataStd);
   tensors.testFeatures =
      normalization.normalizeTensor(tensors.rawTestFeatures, dataMean, dataStd);
};

/**
 * Builds and returns Linear Regression Model.
 *
 * @returns {tf.Sequential} The linear regression model.
 */
export function linearRegressionModel() {
   const model = tf.sequential();
   model.add(tf.layers.dense({ inputShape: [reportsData.numFeatures], units: 1 }));

   model.summary();
   return model;
};

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 1 hidden layer, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel1Hidden() {
   const model = tf.sequential();
   model.add(tf.layers.dense({
      inputShape: [reportsData.numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal'
   }));
   model.add(tf.layers.dense({ units: 1 }));

   model.summary();
   return model;
};

/**
 * Builds and returns Multi Layer Perceptron Regression Model
 * with 2 hidden layers, each with 10 units activated by sigmoid.
 *
 * @returns {tf.Sequential} The multi layer perceptron regression model.
 */
export function multiLayerPerceptronRegressionModel2Hidden() {
   const model = tf.sequential();
   model.add(tf.layers.dense({
      inputShape: [reportsData.numFeatures],
      units: 50,
      activation: 'sigmoid',
      kernelInitializer: 'leCunNormal'
   }));
   model.add(tf.layers.dense(
      { units: 50, activation: 'sigmoid', kernelInitializer: 'leCunNormal' }));
   model.add(tf.layers.dense({ units: 1 }));

   model.summary();
   return model;
};


/**
 * Describe the current linear weights for a human to read.
 *
 * @param {Array} kernel Array of floats of length 12.  One value per feature.
 * @returns {List} List of objects, each with a string feature name, and value
 *     feature weight.
 */
export function describeKernelElements(kernel) {
   tf.util.assert(
      kernel.length == 12,
      `kernel must be a array of length 12, got ${kernel.length}`);
   const outList = [];
   for (let idx = 0; idx < kernel.length; idx++) {
      outList.push({ description: featureDescriptions[idx], value: kernel[idx] });
   }
   return outList;
}


export async function run(model, modelName) {
   model.compile(
      { optimizer: tf.train.sgd(LEARNING_RATE), loss: 'meanSquaredError' });

   let trainLogs = [];

   await model.fit(tensors.trainFeatures, tensors.trainTarget, {
      batchSize: BATCH_SIZE,
      epochs: NUM_EPOCHS,
      validationSplit: 0.2,
      callbacks: {
         onEpochEnd: async (epoch, logs) => {
            trainLogs.push(logs);
         }
      }
   });

   const result = model.evaluate(
      tensors.testFeatures, tensors.testTarget, { batchSize: BATCH_SIZE });
   const testLoss = result.dataSync()[0];

   const trainLoss = trainLogs[trainLogs.length - 1].loss;
   const valLoss = trainLogs[trainLogs.length - 1].val_loss;

   console.log(trainLoss, valLoss, testLoss);
};

export function computeBaseline() {
   const avgPrice = tensors.trainTarget.mean();
   console.log(`Average price: ${avgPrice.dataSync()}`);
   const baseline = tensors.testTarget.sub(avgPrice).square().mean();
   console.log(`Baseline loss: ${baseline.dataSync()}`);
   const baselineMsg = `Baseline loss (meanSquaredError) is ${baseline.dataSync()[0].toFixed(2)}`;
   console.log(baselineMsg);
};

async function start() {
   await reportsData.loadData();

   arraysToTensors();

   computeBaseline();

}

start();