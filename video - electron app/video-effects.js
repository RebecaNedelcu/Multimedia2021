/* Assignment
1. Change the code bellow to make the dimensions of the two canvases equal to the dimensions of the video element
Hint:
When video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight we should have canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;/
if(video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight)/*/

/*2. Implement black&white
Hint: r'=g'=b'=(r+g+b)/3;
3. Implement threshold
Hint: v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0; r’= g’ = b’ = v
4. Implement sephia
Hint: 
r' = (r * .393) + (g *.769) + (b * .189)
g' = (r * .349) + (g *.686) + (b * .168)
b' = (r * .272) + (g *.534) + (b * .131)
5. Implement invert (negative)
Hint: r' = 255 – r; g' = 255 – g; b' = 255 – b;
6. Implement pixelate
Hint: check https://gist.github.com/anonymous/1888841 (the code contains a small mistake ;) )
7. Implement 2Channels
Hint: check https://gist.github.com/anonymous/1888841
8. Implement red
9. Implement green
10. Implement blue
11. Automatically resize the canvas when the size of the video element changes (ex: when the user resizes the browser window, when the user rotates the phone or the tablet)
Hint: 
https://api.jquery.com/resize/
https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onresize
*/

"use strict";

//Note: global letiables should be avoided. Learn more at: https://www.w3.org/wiki/JavaScript_best_practices#Avoid_globals
let effect = "normal";

let video = document.getElementById('video');
let canvas = document.getElementById('canvasProcessed');
let context = canvas.getContext('2d');
let buttons = document.getElementsByClassName("effectType");
for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', function () {
        
        //Restores the previously saved canvas state
        context.restore();
        //Saves the entire state of the canvas by pushing the current state onto a stack
        context.save();
        //more about the data attribute: https://developer.mozilla.org/en/docs/Web/Guide/HTML/Using_data_attributes
        effect = this.dataset.effect;
    });
}

video.addEventListener('play', function () {
    draw(video, context);
    //TODO add the code for resizing the canvas here     
    if(video.clientWidth / video.clientHeight < video.videoWidth / video.videoHeight){
        canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
        canvas.width=   video.clientWidth * video.videoHeight/video.videoHeight;
        }
}, false);


function draw(video, context) {
    if (video.paused || video.ended) {
        return false;
    }

    switch (effect) {
        case "normal":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            break;
        case "rotation":
            let unghi = 3 * Math.PI / 180;
            let ct = Math.cos(unghi), st = Math.sin(unghi);
            let x = video.clientWidth / 2, y = video.clientHeight / 2;
            context.transform(ct, -st, st, ct, -x * ct - y * st + x, x * st - y * ct + y);
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            context.fillText("Rotation Effect", 10, 10);
            break;
        case "emboss":
            //further reading http://html5doctor.com/video-canvas-magic/
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let imageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let pixels = imageData.data;
            let imgDataWidth = imageData.width;

            for (let i = 0; i < pixels.length; i++) {
                if (i % 4 != 3) {
                    pixels[i] = 127 + 2 * pixels[i] - pixels[i + 4] - pixels[i + imgDataWidth * 4];
                }
            }
            context.putImageData(imageData, 0, 0);
            context.fillText("Emboss Effect", 10, 10);
            break;

        case "blackWhite":
        context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        let blackWhiteimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
        let blackWhitepixels = blackWhiteimageData.data;

            for(let i=0; i<blackWhitepixels.length; i+=4){
                const r = blackWhitepixels[i];
                const g = blackWhitepixels[i+1];
                const b = blackWhitepixels[i+2];
                const averageColour = Math.round((r+g+b)/3);
        
                blackWhitepixels[i] = blackWhitepixels[i+1] = blackWhitepixels[i+2] = averageColour;
            }
            //process the pixels
            context.putImageData(blackWhiteimageData, 0, 0);
            break;

        case "sephia":
        context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
        let sepiaimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
        let sepiapixels = sepiaimageData.data;

        for (let i = 0; i < sepiapixels.length; i += 4) {
            const r = sepiapixels[i];
            const g = sepiapixels[i + 1];
            const b = sepiapixels[i + 2];
            //const a = data[i + 3];
           
            sepiapixels[i] = (r * .393) + (g *.769) + (b * .189);
            sepiapixels[i + 1] = (r * .349) + (g * .686) + (b * .168);
            sepiapixels[i + 2] = (r * .272) + (g * .534) + (b * .131);
    
        }
        context.putImageData(sepiaimageData, 0, 0);
        break;

        case "threshold":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let thimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let thpixels = thimageData.data;

            for (let i = 0; i < thpixels.length; i += 4) {
                let r = thpixels[i];
                let g = thpixels[i + 1];
                let b = thpixels[i + 2];
                // const a=data[i+3];
        
                const v = (0.2126*r + 0.7152*g + 0.0722*b >= 99) ? 255 : 0;
                thpixels[i] =thpixels[i + 1] = thpixels[i + 2] = v;
                //r = g = b = v;
            }
            context.putImageData(thimageData, 0, 0);
        break;

        case "red":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let redimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let  redpixels = redimageData.data;
            for (let i = 0; i <  redpixels.length; i += 4) {
                redpixels[i + 1] = 0;
                redpixels[i + 2] = 0;
            }
            context.putImageData(redimageData, 0, 0);
            break;

        case "green":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let greenimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let greenpixels = greenimageData.data;
                for (let i = 0; i < greenpixels.length; i += 4) {
                    greenpixels[i] =  0; //r
                    greenpixels[i + 2] = 0; //b
                }
            context.putImageData(greenimageData, 0, 0);
        break;

        case "blue":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let blueimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let bluepixels = blueimageData.data;
                for (let i = 0; i < bluepixels.length; i += 4) {
                    bluepixels[i] =  0; 
                    bluepixels[i + 1] = 0;
                }
            context.putImageData(blueimageData, 0, 0);
        break;

        case "twoChannels":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let TCimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let TCpixels = TCimageData.data;
                for (let i = 0; i < TCpixels.length; i += 4) {
                    const g = TCpixels[i + 1];
                    TCpixels[i+2] = g; 
            }
            
            context.putImageData(TCimageData, 0, 0);
        break;
        
        case "invert":
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let invertimageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);
            let invertpixels = invertimageData.data;
                for (let i = 0; i < invertpixels.length; i += 4) {
                    const r = invertpixels[i];
                    const g = invertpixels[i + 1];
                    const b = invertpixels[i + 2];
                
                    invertpixels[i] = 255 - r;
                    invertpixels[i + 1] = 255 - g;
                    invertpixels[i + 2] = 255 - b;
            }

            context.putImageData(invertimageData, 0, 0);
        break;

        case "pixelate":
            const blocksize = 10;
            context.drawImage(video, 0, 0, video.clientWidth, video.clientHeight);
            let pximageData = context.getImageData(0, 0, video.clientWidth, video.clientHeight);

            
            for(let x = 1; x <pximageData.width; x += blocksize)
            {
                for(let y = 1; y < pximageData.height; y += blocksize)
                {
                    var pixel = context.getImageData(x, y, 1, 1);
                    context.fillStyle = "rgb("+pixel.data[0]+","+pixel.data[1]+","+pixel.data[2]+")";
                    context.fillRect(x, y, x + blocksize - 1, y + blocksize - 1);
                }
            }
            
        break;
    };

   



    //The setTimeout() method calls a function or evaluates an expression after a specified number of milliseconds.
    //Tip: 1000 ms = 1 second.
    //66ms ~= 15fps
    setTimeout(draw, 66, video, context);
}

window.addEventListener("resize", ()=>{
    canvas.height = video.clientWidth * video.videoHeight / video.videoWidth;
        canvas.width=   video.clientWidth * video.videoHeight/video.videoHeight;
})