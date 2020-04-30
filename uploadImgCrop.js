/**
 * 参考资料：https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
 * Copyright (c) 2020-2021, Cuishunbiao.
 * 
 * Github：https://github.com/cuishunbiao
 * Email：860026526@qq.com
 * 
 * imgType 可以上传其他类型，传了 PNG 的，compress 都是有效果的。
 */
var uploadImgCropFn = function (options) {
    this.el = options.el;
    this.width = options.width;
    this.type = options.type;
    this.callback = options.callback;
    this.imgType = options.imgType ? options.imgType : 'image/png'
    this.compress = options.compress;//除 PNG 外，压缩比例 0 - 1，默认 .92
    this._init();
}
uploadImgCropFn.prototype = {
    _init: function () {
        //监测到 input 变化后，先处理成图片，再处理成 canvas 
        //处理成图片并改变大小
        var self = this;
        var upload = document.getElementById(this.el);
        upload.onchange = function (e) {
            var _file = e.target.files[0];
            this.imgType = _file.type;
            self._readFileFn(_file);
        }
    },
    //读取文件
    _readFileFn: function (file) {
        var self = this;
        var reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            var _img = self._createImageFn(data);
            //canvas 画图
            self._canvasFn(_img);
        };
        reader.readAsDataURL(file);
    },
    //创建图片
    _createImageFn: function (img) {
        let _img = new Image();
        _img.src = img;
        return _img;
    },
    //重新画图片
    _canvasFn: function (img) {
        var self = this;
        var canvas = document.createElement('canvas');
        img.onload = function () {
            var canvas2d = canvas.getContext('2d');
            //输出图的大小
            var width = img.width > self.width ? self.width : img.width;
            var height = img.width > self.width ? img.height * (self.width / img.width) : img.height;
            canvas.width = width;
            canvas.height = height;
            canvas2d.drawImage(img, 0, 0, width, height);
            var resultImg = canvas.toDataURL(self.imgType, self.compress);//执行压缩
            if (self.type === 'blob') {
                resultImg = self._dataURItoBlob(resultImg);
            }
            self.callback(resultImg);//返回数据
        }
    },
    //base64 转 file // 来源于网络
    _dataURItoBlob: function (base64Data) {
        var byteString = atob(base64Data.split(',')[1]);//base64 解码
        var mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];// mime类型
        var arrayBuffer = new ArrayBuffer(byteString.length);//创建缓冲数组
        var intArray = new Uint8Array(arrayBuffer);//创建视图
        for (var i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }
        return new Blob([intArray], { type: mimeString });//转成blob
    }
}
export default uploadImgCropFn;