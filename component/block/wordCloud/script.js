class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/wordcloud2/wordcloud2.min.js");
        this.options = {
            list: [],
            weightFactor: 1,
            color: null,
            rotateRatio: 1,
            backgroundColor: null, // the color of canvas
        };
    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        console.log(key, "=>", value);
        //相应大小变化
        switch (key) {
            //改变大小
            case "width":
            case "height":
                WordCloud(DOMAIN, this.options);
                break;
            case "number":
                this.options.weightFactor = value;
                WordCloud(DOMAIN, this.options);
                break;
            case "data":
                //解析数据
                let arr = [];
                value.forEach((v, i) => {
                    if (i > 0) {
                        arr.push([v[1], v[2]])
                    }
                });
                this.options.list = arr;
                this.options.color = (word, weight) => {
                    let color = null;
                    value.some(v => {
                        if (v[1] === word && v[2] === weight && v[3] && v[3] !== "auto") {
                            color = v[3];
                            return true
                        }
                    });
                    return color || cp.randomColor()
                };
                WordCloud(DOMAIN, this.options);
                break
        }
    }
}