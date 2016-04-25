/// <reference path="../typings/webrtc/MediaStream.d.ts" />
/// <reference path="../lib/UInt8ClampedArray.d.ts" />
/// <reference path="../lib/ImageData.d.ts" />
// https://github.com/Microsoft/TypeScript/issues/949
var ImageDataFixed = ImageData;
var ArrayHelper;
(function (ArrayHelper) {
    function coerce(obj) {
        return Array.prototype.slice.apply(obj);
    }
    ArrayHelper.coerce = coerce;
})(ArrayHelper || (ArrayHelper = {}));
var Selector;
(function (Selector) {
    function all(element, query) {
        return ArrayHelper.coerce(element.querySelectorAll(query));
    }
    Selector.all = all;
})(Selector || (Selector = {}));
var VideoHelper;
(function (VideoHelper) {
    function getFrameCount(video) {
        return video.webkitDecodedFrameCount;
    }
    VideoHelper.getFrameCount = getFrameCount;
})(VideoHelper || (VideoHelper = {}));
var BoundingBox = (function () {
    function BoundingBox(topX, topY, botX, botY) {
        this.topX = topX;
        this.topY = topY;
        this.botX = botX;
        this.botY = botY;
    }
    BoundingBox.prototype.getArea = function () {
        var w = this.botX - this.topX;
        var h = this.botY - this.topY;
        return w * h;
    };
    return BoundingBox;
})();
var BoundingBox;
(function (BoundingBox) {
    function fromElement(child) {
        var x = child.offsetLeft;
        var y = child.offsetTop;
        var w = child.clientWidth;
        var h = child.clientHeight;
        return new BoundingBox(x, y, x + w, y + h);
    }
    BoundingBox.fromElement = fromElement;
})(BoundingBox || (BoundingBox = {}));
var MotionDetector = (function () {
    function MotionDetector(video, threshold, flip, debug) {
        this.video = video;
        this.threshold = threshold;
        this.flip = flip;
        this.debug = debug;
        this.lastData = null;
        this.video = video;
        this.canvas = document.createElement('canvas');
        this.canvas.width = video.clientWidth;
        this.canvas.height = video.clientHeight;
        this.ctx = this.canvas.getContext('2d');
        this.processed = this.capture();
        //this.processed.fill(0);
    }
    MotionDetector.prototype.capture = function () {
        this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.canvas.width, this.canvas.height);
        var imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        var data = imageData.data; // TypeScript bug #949
        return data;
    };
    MotionDetector.prototype.process = function () {
        if (this.lastData === null) {
            this.lastData = this.capture();
            return;
        }
        var a1 = this.lastData;
        var a2 = this.capture();
        var p = this.processed;
        var t = this.threshold;
        for (var i = 0; i < a1.length; i += 4) {
            var d0 = (a1[i + 0] - a2[i + 0]) | 0;
            var d1 = (a1[i + 1] - a2[i + 1]) | 0;
            var d2 = (a1[i + 2] - a2[i + 2]) | 0;
            var x0 = (d0 ^ (d0 >> 31)) - (d0 >> 31);
            var x1 = (d1 ^ (d1 >> 31)) - (d1 >> 31);
            var x2 = (d2 ^ (d2 >> 31)) - (d2 >> 31);
            var y = x0 | x1 | x2;
            var z = y > t ? 0xFF : 0x00;
            p[i + 0] = z;
            p[i + 1] = z;
            p[i + 2] = z;
            p[i + 3] = 0xFF;
        }
        this.lastData = a2;
    };
    MotionDetector.prototype.query = function (threshold, box) {
        var cw = this.canvas.width;
        var p = this.processed;
        var x1 = box.topX;
        var y1 = box.topY;
        var x2 = box.botX;
        var y2 = box.botY;
        if (this.flip) {
            var d = this.canvas.width - x2 - x1;
            x1 += d;
            x2 += d;
        }
        var n = 0;
        for (var i = y1; i < y2; ++i) {
            for (var j = x1; j < x2; ++j) {
                var k = i * cw + j;
                n += p[k << 2] === 0xFF ? 1 : 0;
            }
        }
        if (this.debug && n >= threshold) {
            for (var i = y1; i < y2; ++i) {
                for (var j = x1; j < x2; ++j) {
                    var k = i * this.canvas.width + j;
                    var m = k * 4;
                    p[m + 0] = 0;
                    p[m + 1] = 0xFF;
                    p[m + 2] = 0;
                }
            }
        }
        return n >= threshold;
    };
    MotionDetector.prototype.putDebugData = function (ctx) {
        var imageData = new ImageDataFixed(this.processed, this.canvas.width, this.canvas.height);
        ctx.putImageData(imageData, 0, 0);
    };
    return MotionDetector;
})();
var BoxCollisionDetector = (function () {
    function BoxCollisionDetector(md) {
        this.md = md;
        this.listeners = [];
    }
    BoxCollisionDetector.prototype.register = function (cb) {
        this.listeners.push(cb);
    };
    BoxCollisionDetector.prototype.detect = function () {
        for (var _i = 0, _a = this.listeners; _i < _a.length; _i++) {
            var item = _a[_i];
            if (this.md.query(item.threshold, item.box)) {
                item.callback();
            }
        }
    };
    return BoxCollisionDetector;
})();
var WebcamDisplay = (function () {
    function WebcamDisplay() {
        var _this = this;
        this.onReady = function () { };
        this.acceptStream = function (stream) {
            _this.video.src = URL.createObjectURL(stream);
            _this.video.onloadedmetadata = _this.handleStreamStart;
            _this.video.play();
        };
        this.handleStreamStart = function () {
            _this.onReady();
        };
        this.root = WebcamDisplay.createRoot();
        this.video = WebcamDisplay.createVideoElement(this.root);
    }
    WebcamDisplay.prototype.start = function (parent) {
        parent.appendChild(this.root);
        navigator.webkitGetUserMedia({ video: true, audio: false }, this.acceptStream, function (err) { });
    };
    WebcamDisplay.prototype.getRoot = function () {
        return this.root;
    };
    WebcamDisplay.prototype.getVideo = function () {
        return this.video;
    };
    WebcamDisplay.createRoot = function () {
        var root = document.createElement('div');
        root.classList.add('webcam-display');
        return root;
    };
    WebcamDisplay.createVideoElement = function (parent) {
        var video = document.createElement('video');
        parent.appendChild(video);
        return video;
    };
    return WebcamDisplay;
})();
var WebcamSelectionAdapter = (function () {
    function WebcamSelectionAdapter(webcam, flip, debug) {
        var _this = this;
        this.webcam = webcam;
        this.flip = flip;
        this.debug = debug;
        this.debugCanvasA = null;
        this.debugCtxA = null;
        this.onSelected = function (source) { };
        this.lastFrameCount = 0;
        this.frameWorker = function () {
            var frameCount = VideoHelper.getFrameCount(_this.video);
            if (frameCount !== _this.lastFrameCount) {
                _this.md.process();
                _this.bcd.detect();
                if (_this.debug)
                    _this.md.putDebugData(_this.debugCtxA);
            }
            _this.lastFrameCount = frameCount;
            requestAnimationFrame(_this.frameWorker);
        };
        this.root = WebcamSelectionAdapter.createRoot();
        this.video = webcam.getVideo();
        this.md = new MotionDetector(this.video, 50, flip, debug);
        this.bcd = new BoxCollisionDetector(this.md);
        if (flip) {
            var vendors = ['', '-webkit-', '-moz-'];
            var transformStyle = vendors.map(function (s) { return s + 'transform: rotateY(180deg);'; }).join('');
            this.video.setAttribute('style', transformStyle);
        }
        if (debug)
            this.initDebug();
        this.frameWorker();
        webcam.getRoot().appendChild(this.root);
    }
    WebcamSelectionAdapter.prototype.addButton = function (x, y, button, threshold) {
        var _this = this;
        button.style.left = x + 'px';
        button.style.top = y + 'px';
        this.root.appendChild(button);
        var box = BoundingBox.fromElement(button);
        this.bcd.register({
            box: box,
            threshold: box.getArea() * threshold,
            callback: function () { return _this.onSelected(button); }
        });
    };
    WebcamSelectionAdapter.prototype.loadTemplate = function (template) {
        var instance = document.importNode(template.content, true);
        var buttons = Selector.all(instance, 'button');
        for (var _i = 0; _i < buttons.length; _i++) {
            var button = buttons[_i];
            var x = parseInt(button.getAttribute('data-x'), 10);
            var y = parseInt(button.getAttribute('data-y'), 10);
            var id = parseInt(button.getAttribute('data-id'), 10);
            this.addButton(x, y, button, 0.05);
        }
    };
    WebcamSelectionAdapter.prototype.initDebug = function () {
        this.debugCanvasA = document.createElement('canvas');
        this.debugCanvasA.width = this.video.clientWidth;
        this.debugCanvasA.height = this.video.clientHeight;
        var vendors = ['', '-webkit-', '-moz-'];
        var transformStyle = vendors.map(function (s) { return s + 'transform: rotateY(180deg);'; }).join('');
        this.debugCanvasA.setAttribute('style', transformStyle);
        this.debugCtxA = this.debugCanvasA.getContext('2d');
        document.body.appendChild(this.debugCanvasA);
    };
    WebcamSelectionAdapter.createRoot = function () {
        var stage = document.createElement('div');
        stage.classList.add('webcam-game', 'webcam-selection-game');
        return stage;
    };
    return WebcamSelectionAdapter;
})();
window.addEventListener('load', function () {
    var template = document.querySelector('#game-template');
    var webcam = new WebcamDisplay();
    webcam.start(document.body);
    webcam.onReady = function () {
        var adapter = new WebcamSelectionAdapter(webcam, true, false);
        adapter.loadTemplate(template);
        adapter.onSelected = function (source) {
            //source.click();
            source.onclick();
        };
    };
});
