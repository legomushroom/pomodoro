// Modified by hokein
//
// Copyright 2014 Intel Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// Author: Dongseong Hwang (dongseong.hwang@intel.com)

const { ipcRenderer } = require('electron');

(async () => {
  const emojiesMap = {
    'neutral': '😐',
    'happy': '😊',
    'sad': '😥',
    'angry': '😠', // 😡
    'fearful': '😨',
    'disgusted': '🤢',
    'surprised': '😮'
  };

  const MODEL_URL = './models';

  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  await faceapi.loadFaceExpressionModel(MODEL_URL)

  // SsdMobilenetv1Options
  const minConfidence = 0.5

  // TinyFaceDetectorOptions
  const inputSize = 408
  const scoreThreshold = 0.5

  // MtcnnOptions
  const minFaceSize = 50
  const scaleFactor = 0.8

  xRatio = 400 / 640;
  yRatio = 300 / 480;

  function getFaceDetectorOptions(net) {
    return net === faceapi.nets.ssdMobilenetv1
      ? new faceapi.SsdMobilenetv1Options({ minConfidence })
      : (net === faceapi.nets.tinyFaceDetector
        ? new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
        : new faceapi.MtcnnOptions({ minFaceSize, scaleFactor })
      )
  }

  const faceDetectionOptions = getFaceDetectorOptions(faceapi.nets.ssdMobilenetv1);

  const videoEl = document.querySelector('#js-vsls-video');
  const canvasEl = document.querySelector('#js-vsls-canvas');
  const imageEl = document.querySelector('#js-vsls-image');
  const emojiEl = document.querySelector('#js-vsls-emoji');

  faceapi.env.monkeyPatch({
    Canvas: HTMLCanvasElement,
    Image: HTMLImageElement,
    ImageData: ImageData,
    Video: HTMLVideoElement,
    createCanvasElement: () => document.createElement('canvas'),
    createImageElement: () => document.createElement('img')
  })

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(function (stream) {
        videoEl.srcObject = stream;
      })
      .catch(function (error) {
        console.log(error);
      });

      var ctx = canvasEl.getContext('2d');
      
      setInterval(async () => {
        ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
        const imgData = canvasEl.toDataURL('image/jpg');

        imageEl.onload = async () => {
          const fullFaceDescriptions = await faceapi.detectAllFaces(imageEl, faceDetectionOptions)
            .withFaceExpressions();

          fullFaceDescriptions.map(({ detection, expressions }) => {
            const result = expressions.reduce((acc, item) => {
                if (acc.probability < item.probability) {
                    return item;
                }
                return acc;
            }, expressions[0]);

            emojiEl.setAttribute('class', `vsls-emoji is-${result.expression}`);
            
            emojiEl.style.top = Math.round(detection.box.top * yRatio) - 40;
            emojiEl.style.left = Math.round(detection.box.left * xRatio) - 40;

            if (result) {
              ipcRenderer.send('vsls-expression-update', result.expression);
            }
            
          });
          
        }

        imageEl.src = imgData;
        
      }, 1000);
  }

})();

// const { ipcRenderer } = require('electron');
