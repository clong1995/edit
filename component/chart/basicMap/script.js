class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.min.js");
        cp.loadScriptAsync("/resource/blob/map/china.js");
        this.VI = cp.loadJSONAsync("/resource/vi/echarts.json");
        this.myChart = echarts.init(this.echartsDom);
        this.option = {
            visualMap: {
                calculable: true
            },
            series: [{
                type: 'map',
                map: 'china',
                data: []
            }]
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
                this.myChart.resize();
                break;
            case "VIColor":
                this.option.visualMap["inRange"] = {
                    color: ["#ffffff", this.VI.charts[value][0]]
                };
                this.myChart.setOption(this.option);
                break;
            //改变数据
            case "data":
                this.setData(value);
                break;
            case "realData":
                console.log(value);
                //请求一次
                this.getRealData(value.api, res => this.setData(res));
                if (value.rate) {
                    //轮询请求
                    clearInterval(this.getRealDataSIV);
                    this.getRealDataSIV = setInterval(() => {
                        this.getRealData(value.api, res => this.setData(res));
                    }, parseInt(value.rate) * 1000)
                }
                break;
        }
    }

    setData(value) {
        this.option.series[0].data = [];
        value.forEach((v, i) => {
            if (i) {
                //数据
                this.option.series[0].data.push({
                    name: v[0],
                    value: v[1]
                });
            }
        });
        this.myChart.setOption(this.option);
    }

    getRealData(url, cb) {
        cp.ajax(url, {
            common: true,
            method: "GET",
            success: res => {
                cb(res);
            }
        })
    }
}