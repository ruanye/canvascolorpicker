(function() {
    var defaults = {
        id: '',
        size: 300,
        url: '',
        callback: function() {
            alert('')
        }
    };

    var $ = function(id) {
        return document.getElementById(id)
    };
    var rVal = $('rVal'),
        gVal = $('gVal'),
        bVal = $('bVal'),
        rgbVal = $('rgbVal'),
        preview = $('preview'),
        hexVal = $('hexVal'),
        setCobtn = $('setcolor-btn'),
        setcolot = $('setcolot');



    function CanvasColorPicker(config) {
        this.config = extend(defaults, config);
        this._initContainer();
        this._initCanvas();
        this._drawImg();
        this._attachMouseListeners();
        this._getColorpos();
  

    }

    CanvasColorPicker.prototype._initContainer = function() {
        this.el = document.getElementById(this.config.id);
        if (this.el == null) {
            this.el = document.createElement("div");
            document.body.appendChild(this.el);
        }
    };

    CanvasColorPicker.prototype._initCanvas = function() {
        this.config.callback && this.config.callback();
        if (this.el.tagName.toLowerCase() == "canvas") {
            this.canvas = this.el;
        } else {
            this.canvas = document.createElement("canvas");
            this.el.appendChild(this.canvas);
        }

        this.canvas.setAttribute("width", this.config.size);
        this.canvas.setAttribute("height", this.config.size);

        this.ctx = this.canvas.getContext("2d");

        this.offsetTop = GetRect(this.canvas).top;
        this.offsetLeft = GetRect(this.canvas).left

    };
    CanvasColorPicker.prototype._drawImg = function() {
        var ctx = this.ctx;
        var image = this.image = new Image();

        image.onload = function() {
            ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
        }

        // 添加色轮
        var imageSrc = this.config.url;
        image.src = imageSrc;

    };

    //事件监听
    CanvasColorPicker.prototype._attachMouseListeners = function() {
        var _self = this,
            top = this.offsetTop,
            left = this.offsetLeft;

        this.canvas.addEventListener('mouseup', function(event, setcolorCallback) {
            //获取当前位置的坐标
            getEvent(event, this);
            var canvasX = Math.floor(event.x - left),
                canvasY = Math.floor(event.y - top),
                // 获取当前像素
                imageData = _self.ctx.getImageData(canvasX, canvasY, 1, 1),
                pixel = imageData.data,

                Color = {
                    r: pixel[0],
                    g: pixel[1],
                    b: pixel[2]
                };
         
            _self._updatetMaker(canvasX, canvasY);
            _self._setcolor(Color)

        }, false);


    }



    //初始化maker
    CanvasColorPicker.prototype._updatetMaker = function(x, y) {
        var ctx = this.ctx;
        ctx.clearRect(0, 0, this.config.size, this.config.size);
        ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height);
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 360, false);
        ctx.fillStyle = "#fff"; //填充颜色,默认是黑色
        ctx.fill(); //画实心圆
        ctx.closePath();
    }

    //显示获取到的颜色属性
    CanvasColorPicker.prototype._setcolor = function(Color, x, y) {
        var r, g, b;

        if (Array.isArray(Color)) {
            console.log(0)
            r = Color[0],
                g = Color[1],
                b = Color[2];

        } else {
            r = Color.r,
                g = Color.g,
                b = Color.b;
        }

        rVal.value = r;
        gVal.value = g;
        bVal.value = b;
        rgbVal.value = r + ',' + g + ',' + b;
        //获取rgb颜色和16进制颜色
        dColor = 65536 * r + 256 * g + b;
        hexcolr = '#' + ('0000' + dColor.toString(16)).substr(-6)

        preview.style.backgroundColor = hexcolr;
        hexVal.value = hexcolr;

    }

    
    // 简单对象继承的实现
    function extend(out) {
        out = out || {};

        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj)
                continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object')
                        out[key] = deepExtend(out[key], obj[key]);
                    else
                        out[key] = obj[key];
                }
            }
        }

        return out;
    }
    //获取偏移量的函数
    function GetRect(element) {

        var rect = element.getBoundingClientRect();

        var top = document.documentElement.clientTop;

        var left = document.documentElement.clientLeft;

        return {

            top: rect.top - top,

            bottom: rect.bottom - top,

            left: rect.left - left,

            right: rect.right - left
        }

    }

    //获取颜色坐在坐标
    CanvasColorPicker.prototype.getpos = function(color) {

        var width = this.canvas.width;
        imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        datas = imageData.data;

        for (var i = 0; i < datas.length; i += 4) {
            if (
                color[0] === datas[i] &&
                color[1] === datas[i + 1] &&
                color[2] === datas[i + 2]
            ) {
                break;
            }
        }
        return {
            x: parseInt(i / 4 % width),
            y: parseInt(i / 4 / width)
        }
    }

    //更新maker到坐标点
    CanvasColorPicker.prototype._getColorpos = function() {
        var _self = this;
        setCobtn.addEventListener('click', function(e) {


            var colorValue = setcolot.value.colorRgb(),
                x = _self.getpos(colorValue).x,
                y = _self.getpos(colorValue).y;
            console.log(colorValue)
            preview.style.backgroundColor = setcolot.value;
            _self._setcolor(colorValue)
            _self._updatetMaker(x, y)

            e.preventDefault();
        }, false)
    }
    
    window.CanvasColorPicker = CanvasColorPicker;

    /*16进制颜色转为RGB格式*/
    String.prototype.colorRgb = function() {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = this.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值  
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return sColorChange;
        } else {
            return sColor;
        }

    };

    //event 兼容
    function getEvent(event, original) {
        var eventDoc, doc, body;

        if (event.pageX == null && original.clientX != null) {
            eventDoc = event.target.ownerDocument || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
        }
        return event;
    }

})()