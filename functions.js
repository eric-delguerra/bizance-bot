module.exports = {
    convert : function bytesToMegaBytes(sizeInBytes) {
                    return (sizeInBytes / (1024*1024)).toFixed(2)
                },
    getDataFromFirebase: function (firebase) {
        const dbRef = firebase.database().ref();
        dbRef.child("request").get().then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val()
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }
}
