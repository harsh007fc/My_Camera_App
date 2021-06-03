let request = indexedDB.open("Camera", 1);
let db;
request.onsuccess = function (e) {
    //  if exist then will get db from here 
    db = request.result;
}
request.onerror = function (e) {
    console.log('err');
}
request.onupgradeneeded = function (e) {
    // 1st  create 
    db = request.result;
    db.createObjectStore('gallery',{ keyPath: "mId" });
    // db.createObjectStore("video", { keyPath: "mid" });
}
function addMediaToGallery(data, type) {
    if (db) {
        // you need to get transaction
        let tx = db.transaction('gallery', 'readwrite');
        // get table refer
        let gallery = tx.objectStore('gallery');
        // add
        gallery.add({ mId: Date.now(),type, media: data});

    } else {
        alert("db is loading")
    }
}

function viewMedia(){
    let body =  document.querySelector("body");
    let tx = db.transaction('gallery','readonly');
    let gallery = tx.objectStore('gallery');
    let req = gallery.openCursor();
    req.onsuccess = function(){
        let cursor = req.result;
        if(cursor){
            if(cursor.value.type == 'video'){
                let vidContainer = document.createElement('div');
                vidContainer.setAttribute('data-mId',cursor.value.mId);
                vidContainer.classList.add('gallery-vid-container');
                let video = document.createElement('video');
                vidContainer.appendChild(video);
                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('gallery-delete-button');
                deleteBtn.innerText='Delete';
                deleteBtn.addEventListener('click',deleteBtnHandler);
                let downloadBtn = document.createElement('button');
                downloadBtn.classList.add('gallery-download-button');
                downloadBtn.innerText='Download';
                downloadBtn.addEventListener('click',downloadBtnHandler);
                vidContainer.appendChild(deleteBtn);
                vidContainer.appendChild(downloadBtn);
                video.controls=true;
                video.autoplay= true;
                video.src = URL.createObjectURL(cursor.value.media);
                body.appendChild(vidContainer);
            }
            else{
                let imgContainer = document.createElement('div');
                imgContainer.setAttribute('data-mId',cursor.value.mId);
                imgContainer.classList.add('gallery-img-container');
                let img = document.createElement('img');
                img.src = cursor.value.media;
                imgContainer.appendChild(img);
                let deleteBtn = document.createElement('button');
                deleteBtn.classList.add('gallery-delete-button');
                deleteBtn.innerText='Delete';
                deleteBtn.addEventListener('click',deleteBtnHandler);
                let downloadBtn = document.createElement('button');
                downloadBtn.classList.add('gallery-download-button');
                downloadBtn.innerText='Download';
                downloadBtn.addEventListener('click',downloadBtnHandler);
                imgContainer.appendChild(deleteBtn);
                imgContainer.appendChild(downloadBtn);
                body.appendChild(imgContainer);
            }
            cursor.continue();
        }

    }


}


function deleteMediaFromGallery(mId)
{
    let tx = db.transaction('gallery','readwrite');
    let gallery = tx.objectStore('gallery');
    gallery.delete(Number(mId));
}
function deleteBtnHandler(e)
{
    let mId = e.currentTarget.parentNode.getAttribute('data-mId');
    deleteMediaFromGallery(mId);
    e.currentTarget.parentNode.remove();
}


function downloadBtnHandler(e){
    let a = document.createElement('a');
    a.href = e.currentTarget.parentNode.children[0].src;
    if(e.currentTarget.parentNode.children[0].nodeName == 'IMG'){
        a.download = 'image.png';
    }
    else{
        a.download = 'video.mp4';
    }
    a.click();
    a.remove();
}