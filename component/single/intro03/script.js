class Module {
    DOM() {
        this.wrapDom = cp.query(".wrap", DOMAIN);
        this.innerDom = cp.query(".inner", this.wrapDom);
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
            case "color":
                cp.css(this.innerDom, {
                    backgroundColor: value ? value : null
                });
                break;
            case "border":
                cp.css(this.wrapDom, {
                    borderTopColor: value ? value : null
                });
                cp.css(this.wrapDom, {
                    borderBottomColor: value ? value : null
                });
                cp.css(this.innerDom, {
                    borderColor: value ? value : null
                });
                break;
            case "textarea":
                value = value.replace(/\r\n/g, "<br>");
                value = value.replace(/\n/g, "<br>");
                cp.html(this.innerDom, value);
                break;
            default:
        }
    }
}