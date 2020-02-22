class Module {
    DOM() {

    }

    EVENT() {
        this.borderDom = cp.query(".border", DOMAIN);
    }

    INIT() {
        this.style = "solid";
        this.color = "#000000";
        this.weight = "2";
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
            case "style":
                this.style = value;
                this.borderStyle();
                break;
            case "color":
                this.color = value;
                this.borderStyle();
                break;
            case "weight":
                this.weight = value;
                this.borderStyle();
                break;
            default:
        }
    }

    borderStyle() {
        cp.css(this.borderDom, {
            border: `${this.weight}px ${this.style} ${this.color}`
        });
    }
}