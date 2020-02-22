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
            legend: {
                data: ['预算分配', '实际开销']
            },
            radar: {
                name: {
                    textStyle: {
                        color: '#000000',
                    }
                },
                indicator: [
                    {name: '销售', max: 6500},
                    {name: '管理', max: 16000},
                    {name: '信息技术', max: 30000},
                    {name: '客服', max: 38000},
                    {name: '研发', max: 52000},
                    {name: '市场', max: 25000}
                ]
            },
            series: [{
                type: 'radar',
                data: [
                    {
                        value: [4300, 10000, 28000, 35000, 50000, 19000],
                        name: '预算分配'
                    },
                    {
                        value: [5000, 14000, 28000, 31000, 42000, 21000],
                        name: '实际开销'
                    }
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