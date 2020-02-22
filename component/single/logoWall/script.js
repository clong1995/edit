class Module {
    DOM() {
        this.wrapDom = cp.query(".wrap", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        this.id = DOMAIN.id.split("_")[1];
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
            case "data":
                let html = "";
                value.forEach(v => {
                    let image = v[2].split("||");
                    if (image.length === 2) {
                        image = image[1]
                    } else {
                        image = PATH + "/img/default.png"
                    }
                    console.log(cp.domSize(image));
                    html += `<div class="item">
                            <div class="content activee">
                                <div class="image" style='background-image: url("${image}")'></div>
                                <div class="name centerWrap">${v[1]}</div>
                            </div>
                        </div>`
                });
                cp.html(this.wrapDom, html);
                break;
            case "number":
                console.log("#slice_" + this.id + " > .wrap > .item");
                let margin = value / 40;
                if (margin < 1) {
                    margin = 1;
                }
                cp.setSheet("#slice_" + this.id + " > .wrap > .item", {
                    width: value + 'px',
                    height: value + 'px',
                    margin: margin + "px"
                });
                break;
            default:
        }
    }
}