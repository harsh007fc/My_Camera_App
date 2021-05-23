let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let timingElem = document.querySelector("#timing");
let allFilters = document.querySelectorAll(".filter");
let uiFilter = document.querySelector(".ui-filter");
let recordState = false;
let clearObj;
let filterColor = "";
videoRecorder.addEventListener("click",function(){
    if (!mediaRecorder) {
        alert("First allow permissions");
        return;
    }
    if(recordState == false){
        mediaRecorder.start();
        // videoRecorder.innerHTML = "Recording...";
        videoRecorder.classList.add("record-animation");
        startCounting();
        
        recordState = true;
    }else{
        mediaRecorder.stop();
        // videoRecorder.innerHTML = "Record";
        videoRecorder.classList.remove("record-animation");
        stopCounting();
        recordState = false;
    }
})
// let audioElem = document.querySelector("audio");
let constraints = {
    video:true,
    audio:true,
}
let mediaRecorder;
let buffer = [];  //to store stream of video
let videoElem = document.querySelector("#video-elem")


//stream yahaan local hai means apne hi device se aa rhi hai]]
navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream){
    // console.log(mediaStream);
    // alert("received media")

    videoElem.srcObject = mediaStream;
    // audioElem.srcObject = mediaStream;

    mediaRecorder = new MediaRecorder(mediaStream); //rec abhi start nhi hui hia

    // if(recordState)
    mediaRecorder.addEventListener("dataavailable",function(e){
    buffer.push(e.data);
})
mediaRecorder.addEventListener("stop",function(){
    //mime type
    let blob = new Blob(buffer,{type:"video/mp4"});
    // fnctn to convert blob to url
    let url = window.URL.createObjectURL(blob);
    // download btn
    let a = document.createElement("a");
    a.download = "file.mp4";
    a.href = url;
    a.click();
    buffer = []; //to prevernt redownload of prev video
})

}).catch(function(err){
    console.log(err);
});

captureBtn.addEventListener("click",function(){
    let canvas = document.createElement("canvas");
    canvas.width = videoElem.videoWidth;
    canvas.height = videoElem.videoHeight;
    let tool = canvas.getContext("2d");
    captureBtn.classList.add("capture-animation");
    // draw a frame on canvas
    tool.drawImage(videoElem,0,0);
    // add filter color to clicked image
    tool.fillStyle = filterColor;
    // translucent
    tool.fillRect(0,0,canvas.width,canvas.height);
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = "file.png";
    anchor.click();
    anchor.remove();
    canvas.remove();
    setTimeout(function(){
        captureBtn.classList.remove("capture-animation");
    },1000)
});

function startCounting(){
    timingElem.classList.add("timing-active");
    let timeCount = 0;
    clearObj = setInterval(function(){
        let seconds = (timeCount % 60) < 10 ? `0${(timeCount % 60)}`:(`${(timeCount % 60)}`);
        let minutes = (timeCount / 60) < 10 ? `0${Number.parseInt(timeCount / 60)}`:(`${Number.parseInt(timeCount / 60)}`);
        let hours = (timeCount / 3600) < 10 ? `0${Number.parseInt(timeCount / 3600)}`:(`${Number.parseInt(timeCount / 3600)}`);
        timingElem.innerText = `${hours}:${minutes}:${seconds}`;
        timeCount++;
    },1000)
}

function stopCounting(){
    timingElem.classList.remove("timing-active");
    timingElem.innerText = "00:00:00";
    clearInterval(clearObj);
}

// applying filter

for(let i = 0; i < allFilters.length; i++){
    allFilters[i].addEventListener("click",function(){
        //add filter to ui
        let color = allFilters[i].style.backgroundColor;
        if(color){
            uiFilter.classList.add("ui-filter-active");
            uiFilter.style.backgroundColor = color;
            filterColor = color;
        }else{
            uiFilter.classList.remove("ui-filter-active");
            uiFilter.style.backgroundColor = "";
            filterColor = "";

        }
    })
}



