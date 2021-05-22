let videoRecorder = document.querySelector("#record-video");
let captureBtn = document.querySelector("#capture");
let recordState = false;
videoRecorder.addEventListener("click",function(){
    if(recordState == false){
        mediaRecorder.start();
        videoRecorder.innerHTML = "Recording...";
        recordState = true;
    }else{
        mediaRecorder.stop();
        videoRecorder.innerHTML = "Recording...";
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
    // draw a frame on canvas
    tool.drawImage(videoElem,0,0);
    let link = canvas.toDataURL();
    let anchor = document.createElement("a");
    anchor.href = link;
    anchor.download = "file.png";
    anchor.click();
    anchor.remove();
    canvas.remove();
})
