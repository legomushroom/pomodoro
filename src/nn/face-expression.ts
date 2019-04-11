import * as path from 'path';
import * as faceapi from 'face-api.js';

export const faceDetectionNet = faceapi.nets.ssdMobilenetv1

import { canvas } from './env';
import { faceDetectionOptions } from './face-detection-options';
import { saveFile } from './save-file';

var NodeWebcam = require( "node-webcam" );

let cnt = 0;

export async function run() {
    const weightsPath = path.join(__dirname, '../../weights');
    await faceDetectionNet.loadFromDisk(weightsPath)
    await faceapi.nets.faceExpressionNet.loadFromDisk(weightsPath);

    setInterval(() => {
        NodeWebcam.capture( "test_picture", {
            callbackReturn: 'base64'
        }, async function(err, data) {
            if (err) {
                throw err;
            }
    
            const img = await canvas.loadImage(data);
            const results = await faceapi.detectAllFaces(img, faceDetectionOptions)
                .withFaceExpressions()
    
            const out = faceapi.createCanvasFromMedia(img) as any
            faceapi.drawDetection(out, results.map(res => res.detection), { withScore: false })
            faceapi.drawFaceExpressions(
                out,
                results.map(({ detection, expressions }) => {
                    const result = expressions.reduce((acc, item) => {
                        if ((acc as any).probability < item.probability) {
                            return item;
                        }
                        return acc;
                    }, expressions[0]);
    
                    if (result) {
                        console.log(JSON.stringify(result));
                    }
    
                    return { position: detection.box, expressions };
                })
            )
                
            const imageName = `faceExpressionRecognition_${cnt++}.jpg`;
            saveFile(imageName, out.toBuffer('image/jpeg'))
            // console.log(`done, saved results to ${imageName}`)
        });
    }, 1500);
}