class Module {
    DOM() {

    }

    EVENT() {

    }

    INIT() {
        cp.addClass(DOMAIN, "centerWrap");
        let date = cp.date("yyyy-MM-dd");
        cp.text(DOMAIN, date);
    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        switch (key) {
            case "height":
                cp.css(DOMAIN, {
                    fontSize: value * .6 + "px"
                });
                break;
            default:
        }
    }
}