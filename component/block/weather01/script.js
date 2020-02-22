class Module {
    DOM() {
        this.iconDom = cp.query(".icon", DOMAIN);
        this.cityDom = cp.query(".city", DOMAIN);
        this.temperatureDom = cp.query(".temperature", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        //获取实时数据

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
            case "height":
                //城市大小
                cp.css(this.cityDom, {
                    fontSize: value * .2 + "px"
                });
                //修改图标大小
                cp.css(this.iconDom, {
                    fontSize: value * .4 + "px"
                });
                //修改文字大小
                cp.css(this.temperatureDom, {
                    fontSize: value * .2 + "px"
                });
                break;
            case "text":
                this.weather(value);
                break;
            default:
        }
    }

    weather(value) {
        cp.ajax(CONF.ServerAddr + "/other/weather", {
            data: {
                city: value
            },
            success: res => {
                let data = JSON.parse(res.data);
                console.log(data);
                if (data.lives.length > 0 && data.lives[0].length !== 0) {
                    let d = data.lives[0];
                    //城市
                    cp.text(this.cityDom, d.city);
                    //温度
                    cp.text(this.temperatureDom, d.weather + " " + d.temperature + "°");
                    //天气图标
                    let icon = {
                        "晴": "&#xe626;",
                        "少云": "&#xe626;",
                        "晴间多云": "&#xe628;",
                        "多云": "&#xe628;",
                        "阴": "&#xe628;",
                        "有风": "&#xe62d;",
                        "平静": "&#xe626;",
                        "微风": "&#xe626;",
                        "和风": "&#xe626;",
                        "清风": "&#xe626;",
                        "强风/劲风": "&#xe62d;",
                        "疾风": "&#xe62d;",
                        "大风": "&#xe62d;",
                        "烈风": "&#xe62d;",
                        "风暴": "&#xe62d;",
                        "狂爆风": "&#xe62d;",
                        "飓风": "&#xe62d;",
                        "热带风暴": "&#xe62d;",
                        "阵雨": "&#xe625;",
                        "雷阵雨": "&#xe625;",
                        "雷阵雨并伴有冰雹": "&#xe625;",
                        "小雨": "&#xe625;",
                        "中雨": "&#xe625;",
                        "大雨": "&#xe625;",
                        "暴雨": "&#xe625;",
                        "大暴雨": "&#xe625;",
                        "特大暴雨": "&#xe625;",
                        "强阵雨": "&#xe625;",
                        "强雷阵雨": "&#xe625;",
                        "极端降雨": "&#xe625;",
                        "毛毛雨/细雨": "&#xe625;",
                        "雨": "&#xe625;",
                        "小雨-中雨": "&#xe625;",
                        "中雨-大雨": "&#xe625;",
                        "大雨-暴雨": "&#xe625;",
                        "暴雨-大暴雨": "&#xe625;",
                        "大暴雨-特大暴雨": "&#xe625;",
                        "雨雪天气": "&#xe627;",
                        "雨夹雪": "&#xe627;",
                        "阵雨夹雪": "&#xe627;",
                        "冻雨": "&#xe627;",
                        "雪": "&#xe627;",
                        "阵雪": "&#xe627;",
                        "小雪": "&#xe627;",
                        "中雪": "&#xe627;",
                        "大雪": "&#xe627;",
                        "暴雪": "&#xe627;",
                        "小雪-中雪": "&#xe627;",
                        "中雪-大雪": "&#xe627;",
                        "大雪-暴雪": "&#xe627;",
                        "浮尘": "&#xe62b;",
                        "扬沙": "&#xe62b;",
                        "沙尘暴": "&#xe62b;",
                        "强沙尘暴": "&#xe62b;",
                        "龙卷风": "&#xe62b;",
                        "雾": "&#xe62b;",
                        "浓雾": "&#xe62b;",
                        "强浓雾": "&#xe62b;",
                        "轻雾": "&#xe62b;",
                        "大雾": "&#xe62b;",
                        "特强浓雾": "&#xe62b;",
                        "霾": "&#xe62b;",
                        "中度霾": "&#xe62b;",
                        "重度霾": "&#xe62b;",
                        "严重霾": "&#xe62b;",
                        "热": "&#xe633;",
                        "冷": "&#xe633;",
                        "未知": "&#xe633;"
                    };
                    this.iconDom.innerHTML = icon[d.weather];
                } else {
                    cp.text(this.cityDom, "城市");
                    cp.text(this.temperatureDom, "天气 0");
                    this.iconDom.innerHTML = "&#xe633;";
                }
            }
        })
    }
}