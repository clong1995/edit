class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.min.js");
        this.VI = cp.loadJSONAsync("/resource/vi/echarts.json");
        this.myChart = echarts.init(this.echartsDom);
        this.option = {
            tooltip: {},
            legend: {
                data: []
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: []
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
                break;//改变数据
            case "VIColor":
                this.option.color = this.VI.charts[value];
                this.myChart.setOption(this.option);
                break;
            case "legendPosition":
                if (value === "top") {
                    this.option.legend.orient = "horizontal";
                    this.option.legend.x = "center";
                    this.option.legend.y = "top";
                } else if (value === "right") {
                    this.option.legend.orient = "vertical";
                    this.option.legend.x = "right";
                    this.option.legend.y = "center";
                } else if (value === "bottom") {
                    this.option.legend.orient = "horizontal";
                    this.option.legend.x = "center";
                    this.option.legend.y = "bottom";

                } else if (value === "left") {
                    this.option.legend.orient = "vertical";
                    this.option.legend.x = "left";
                    this.option.legend.y = "center";
                }
                this.myChart.setOption(this.option);
                break;
            case "legendDisplay":
                this.option.legend.show = value === "show";
                this.myChart.setOption(this.option);
                break;
            case "legendColor":
                this.option.legend["textStyle"] = {
                    color: value
                };
                this.myChart.setOption(this.option);
                break;
            case "axisColor": {
                let show = true;
                if (value === "") {
                    show = false;
                }
                this.option.xAxis["axisLine"] = {
                    show: show,
                    lineStyle: {
                        color: value
                    }
                };
                this.option.yAxis["axisLine"] = {
                    show: show,
                    lineStyle: {
                        color: value
                    }
                };
                this.myChart.setOption(this.option);
                break;
            }
            case "axisLabelColor": {
                let show = true;
                if (value === "") {
                    show = false;
                }
                this.option.xAxis["axisLabel"] = {
                    show: show,
                    textStyle: {
                        color: value
                    }
                };
                this.option.yAxis["axisLabel"] = {
                    show: show,
                    textStyle: {
                        color: value
                    }
                };
                this.myChart.setOption(this.option);
                break;
            }
            case "xSplitLineColor": {
                let show = true;
                if (value === "") {
                    show = false;
                }
                this.option.xAxis["splitLine"] = {
                    show: show,
                    lineStyle: {
                        color: value
                    }
                };
                this.myChart.setOption(this.option);
                break;
            }
            case "ySplitLineColor": {
                let show = true;
                if (value === "") {
                    show = false;
                }
                this.option.yAxis["splitLine"] = {
                    show: show,
                    lineStyle: {
                        color: value
                    }
                };
                this.myChart.setOption(this.option);
                break;
            }
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
        this.option.xAxis.data = [];
        this.option.legend.data = [];
        this.option.series = [];
        value.forEach((v, i) => {
            if (!i) {
                //表头
                v.forEach((vv, ii) => {
                    if (ii) {
                        this.option.xAxis.data.push(vv);
                    }
                })
            } else {
                //数据
                v.forEach((vv, ii) => {
                    if (!ii) {
                        this.option.legend.data.push(vv);
                        this.option.series.push({
                            name: vv,
                            type: 'bar',
                            data: []
                        });
                    } else {
                        this.option.series[i - 1].data.push(vv)
                    }
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