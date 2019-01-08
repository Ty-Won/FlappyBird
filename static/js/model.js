import * as tf from '@tensorflow/tfjs'

const model = tf.sequential();
model.add(tf.layers.dense({units: 5, inputShape:[3]}));

model.compile({loss:'meanSquaredError', optimizer:'sgd'});