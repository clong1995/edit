class Module {
    DOM() {
        this.multiDom = cp.query(".multi", DOMAIN);
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
            case "textarea":
                value = value.replace(/\r\n/g, "<br>");
                value = value.replace(/\n/g, "<br>");
                cp.html(this.multiDom, value);
                break;
            case "textAlign":
                if (value === "center") {//居中
                    cp.addClass(this.multiDom, "center");
                    cp.removeClass(this.multiDom, "left");
                    cp.removeClass(this.multiDom, "right");
                }
                if (value === "left") {//左
                    cp.removeClass(this.multiDom, "center");
                    cp.addClass(this.multiDom, "left");
                    cp.removeClass(this.multiDom, "right");
                }
                if (value === "right") {//右
                    cp.removeClass(this.multiDom, "center");
                    cp.removeClass(this.multiDom, "left");
                    cp.addClass(this.multiDom, "right");
                }
                break;
            /*case "font/size":
                cp.css(this.multiDom, {
                    fontSize: value + "px"
                });
                break;
            case "font/family":
                cp.css(this.multiDom, {
                    fontFamily: value
                });
                break;
            case "font/color":
                cp.css(this.multiDom, {
                    color: value
                });
                break;*/
            default:
        }
    }
}