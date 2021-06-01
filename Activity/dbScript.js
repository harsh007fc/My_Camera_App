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