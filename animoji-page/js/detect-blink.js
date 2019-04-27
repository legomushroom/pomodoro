(function() {
    var _blinked = false;
    var _oldFaceShapeVertices = [];
    var _timeOut = -1;
    var blinkN = -1;

    function blink(n) {
        _blinked = true;
    
        if(_timeOut > -1) { clearTimeout(_timeOut); }
        blinkN = n;
    
        _timeOut = setTimeout(resetBlink, 150);
    }
    
    function resetBlink() {
        blinkN = -1;
        _blinked = false;
    }
    
    function storeFaceShapeVertices(vertices) {
        for(var i = 0, l = vertices.length; i < l; i++) {
            _oldFaceShapeVertices[i] = vertices[i];
        }
    }
    
    window.vslsDetectBlink = (v) => {
        // for(var i = 0; i < faces.length; i++) {
    
        //     var face = faces[i];
        
        //     if(face.state === brfv4.BRFState.FACE_TRACKING) {
        
                // simple blink detection
        
                // A simple approach with quite a lot false positives. Fast movement can't be
                // handled properly. This code is quite good when it comes to
                // staring contest apps though.
        
                // It basically compares the old positions of the eye points to the current ones.
                // If rapid movement of the current points was detected it's considered a blink.
        
                // var v = face.vertices;
        
                if(_oldFaceShapeVertices.length === 0) storeFaceShapeVertices(v);
        
                var k, l, yLE, yRE;
        
                // Left eye movement (y)
        
                for(k = 36, l = 41, yLE = 0; k <= l; k++) {
                    yLE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                }
                yLE /= 6;
        
                // Right eye movement (y)
        
                for(k = 42, l = 47, yRE = 0; k <= l; k++) {
                    yRE += v[k * 2 + 1] - _oldFaceShapeVertices[k * 2 + 1];
                }
        
                yRE /= 6;
        
                var yN = 0;
        
                // Compare to overall movement (nose y)
        
                yN += v[27 * 2 + 1] - _oldFaceShapeVertices[27 * 2 + 1];
                yN += v[28 * 2 + 1] - _oldFaceShapeVertices[28 * 2 + 1];
                yN += v[29 * 2 + 1] - _oldFaceShapeVertices[29 * 2 + 1];
                yN += v[30 * 2 + 1] - _oldFaceShapeVertices[30 * 2 + 1];
                yN /= 4;
        
                var blinkRatio = Math.abs((yLE + yRE) / yN);
        
                // if((blinkRatio > 12 && (yLE > 0.4 || yRE > 0.4))) {
                //     // console.log("blink " + blinkRatio.toFixed(2) + " " + yLE.toFixed(2) + " " + yRE.toFixed(2) + " " + yN.toFixed(2));
        
                //     blink();
                // }

                storeFaceShapeVertices(v);

                var isRatio = (blinkRatio > 12);
                var isLeftBlink = (yLE > 0.8);
                var isRightBlink = (yRE > 0.8);

                if (!isRatio) {
                    return;
                }
                
                // console.clear();
                // console.log(`isLeftBlink: ${isLeftBlink}, ${yLE}, ${blinkRatio}`);
                // console.log(`isRightBlink: ${isRightBlink}, ${yRE}, ${blinkRatio}`);

                const ratio = (yLE / yRE);

                if (isLeftBlink && !isRightBlink) {
                    return 0;
                }

                if (isRightBlink && !isLeftBlink) {
                    return 1;
                }

                if ((isRightBlink && isLeftBlink) && (Math.abs(yLE - yRE) < .1)) {
                    return 2;
                }

                return -1;
            }
        // }
    // }
})();