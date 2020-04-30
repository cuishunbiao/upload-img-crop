```
new uploadImgCropFn({
    el:'upload',
    width: 1000,
    type: 'blob',
    callback: function(res){
        var formData = new FormData();
        formData.append("uploadFile", res, 'image.png');
        var request = new XMLHttpRequest();
        request.open("POST", "send.php");
        request.send(formData);
        
        // let _img = new Image();
        // _img.src = res;
        // document.body.appendChild(_img);
    }
})
```