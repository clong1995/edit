class Module {
    DOM() {
        this.startColor = "#C13530";
        this.endColor = "#D38264";
        this.direction = "90deg";
        this.distance = "50";
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
            case "startColor":
                this.startColor = value;
                this.linearGradient();
                break;
            case "endColor":
                this.endColor = value;
                this.linearGradient();
                break;
            case "direction":
                this.direction = value;
                this.linearGradient();
                break;
            case "distance":
                this.distance = value;
                this.linearGradient();
                break;
            default:
        }
    }

    linearGradient() {
        cp.css(DOMAIN, {
            "background": `linear-gradient(${this.direction}, ${this.startColor},${this.distance}%, ${this.endColor})`
        });
    }
}