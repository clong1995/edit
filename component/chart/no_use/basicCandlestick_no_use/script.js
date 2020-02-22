class Module {
    DOM() {
        this.echartsDom = cp.query(".echarts", DOMAIN);
    }

    EVENT() {

    }

    INIT() {
        cp.loadScriptAsync("/resource/lib/echarts/echarts.min.js");
        let myChart = echarts.init(this.echartsDom);
        let option = {
            title: {
                text: '基础k线图'
            },
            xAxis: {
                data: ['2017', '2018', '2019', '2020']
            },
            yAxis: {},
            series: [{
                type: 'k',
                data: [
                    [20, 30, 10, 35],
                    [40, 35, 30, 55],
                    [33, 38, 33, 40],
                    [40, 40, 32, 42]
                ]
            }]
        };
        myChart.setOption(option);
    }

    /**
     * 当右侧的配置改变的时候，就会自动调用这个方法，给你返回修改的数据
     * @param key
     * @param value
     * @constructor
     */
    OPTION(key, value) {
        console.log(key, value);

    }
}