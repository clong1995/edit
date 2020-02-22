class Module {
    DOM() {
        cp.addClass(DOMAIN, "centerWrap")
    }

    EVENT() {
        this.borderDom = cp.query(".border", DOMAIN);
    }

    INIT() {
        this.direction = "horizontal";
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
            case "direction":
                this.direction = value;
                this.borderStyle();
                break;
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
            borderTop: "none",
            borderLeft: "none"
        });

        let style = `${this.weight}px ${this.style} ${this.color}`;
        if (this.direction === "horizontal") {
            cp.css(this.borderDom, {
                width: "100%",
                height: "1px",
                borderTop: style
            });
        } else {
            cp.css(this.borderDom, {
                width: "1px",
                height: "100%",
                borderLeft: style
            });
        }
    }
}