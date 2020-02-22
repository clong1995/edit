class Module {
    DOM() {
    }

    EVENT() {

    }

    INIT() {
        this.readOnlyData = null;
        this.id = DOMAIN.id.split("_")[1];
    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        switch (key) {
            //数据
            case "data": {
                this.readOnlyData = value;
                this.createDot();
                break;
            }
            //尺寸
            case "width":
            case "height": {
                this.createDot(value);
                break;
            }
            //圈内
            case"circle/color": {
                cp.setSheet("#slice_" + this.id + " .time", {
                    color: value
                });
                break;
            }
            case"circle/size": {
                cp.setSheet("#slice_" + this.id + " .time", {
                    fontSize: value + 'px',
                    lineHeight: value * 1.2 + 'px',
                });
                break;
            }
            case"circle/family": {
                cp.setSheet("#slice_" + this.id + " .time", {
                    family: value
                });
                break;
            }
            //标题
            case"title/color": {
                cp.setSheet("#slice_" + this.id + " .title", {
                    color: value
                });
                break;
            }
            case"title/size": {
                cp.setSheet("#slice_" + this.id + " .title", {
                    fontSize: value + 'px',
                    lineHeight: value * 1.8 + 'px'
                });
                break;
            }
            case"title/family": {
                cp.setSheet("#slice_" + this.id + " .title", {
                    family: value
                });
                break;
            }
            //文本
            case"text/color": {
                cp.setSheet("#slice_" + this.id + " .text", {
                    color: value
                });
                break;
            }
            case"text/size": {
                cp.setSheet("#slice_" + this.id + " .text", {
                    fontSize: value + 'px',
                    lineHeight: value * 1.5 + 'px'
                });
                break;
            }
            case"text/family": {
                cp.setSheet("#slice_" + this.id + " .text", {
                    family: value
                });
                break;
            }
            case"fill": {
                cp.setSheet("#slice_" + this.id + " .item", {
                    background : value
                });
                break;
            }
            default:
        }
    }

    createDot() {
        if (!this.readOnlyData) {
            return
        }
        let len = this.readOnlyData.length - 1;
        let {width, height} = cp.domSize(DOMAIN);
        let x = parseInt(width / len);
        let wh = x / 2;
        let html = '';
        let t = height / 10;
        let offset = (height - wh) / 2;
        for (let i = 0; i < len; i++) {
            let l = x * i;
            let y = Math.sin(l) * t;
            html += `<div class="item" style="
                    top:${y + offset}px;
                    left:${l + wh / 2}px;
                    width:${wh}px;
                    height:${wh}px;
                    ">
                        <div class="time">${this.readOnlyData[i + 1][2]}</div>
                        <div class="content ${Math.random() > 0.5 ? "top" : "bottom"}">
                            <div class="pos">
                                <div class="title">${this.readOnlyData[i + 1][3]}</div>
                                <div class="text">${this.readOnlyData[i + 1][4]}</div>
                            </div>
                        </div>
                    </div>`;
        }
        //content宽度
        cp.setSheet("#slice_" + this.id + " .content", {
            width: (x - wh / 2) + 'px'
        });
        cp.setSheet("#slice_" + this.id + " .pos", {
            width: "calc(100 - " + x * .05 + "px)",
            left: x * .05 + 'px'
        });
        cp.empty(DOMAIN);
        cp.html(DOMAIN, html)
    }
}