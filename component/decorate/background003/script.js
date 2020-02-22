class Module {
    DOM() {
        this.videoDom = cp.query("img", DOMAIN);
    }

    EVENT() {

    }

    INIT() {

    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        console.log(key, value);
        switch (key) {
            case "url":
                this.videoDom.src = value;
                break;
            case "fill":
                cp.css(this.videoDom, {
                    objectFit: value
                });
                break;
            case "opacity":
                console.log(value / 100);
                cp.css(this.videoDom, {
                    opacity: value / 100
                });
                break;
            default:
        }
    }
}