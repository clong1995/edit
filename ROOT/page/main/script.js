class App {
    DOM() {
        this.editDom = cp.query(".data-editor");
        this.containerDom = cp.query(".container", this.editDom);
    }

    //初始化函数
    INIT() {
        //ipc
        /*try {
            this.ipc = require('electron').ipcRenderer;
        } catch (e) {
            console.log("不是客户端环境");
            this.ipc = null
        }*/

        /*try {
            this.BrowserWindow = require('electron').remote.BrowserWindow
        } catch (e) {
            console.log("不是客户端环境");
        }*/


        this.sceneId = null;
        //let project_scene = cp.getLocTempData();//项目id
        //保存项目id
        let pid = localStorage.getItem("pid");


        //============= TODO 开发故意为之 =======\\
        /*setTimeout(() => {
            this.getModule("menu").getComponent("single/history01");
        }, 500);*/
        //====================================//

        //没有项目直接调走
        if (!pid) {
            cp.link('/project');
        }
    }

    //添加事件
    EVENT() {
        cp.on('.drag-title', this.editDom, 'mousedown', t => this._dateEditTitleMousedown(t));
        cp.on('.close', this.containerDom, 'click', t => this.dateEditClose(t));

        //离开保存
        window.onbeforeunload = () => {
            //判断新的数据的md5
            let currMD5 = md5(JSON.stringify(this.scene));
            if (currMD5 !== this.prevDataMD5) {
                //打开确认保存的弹窗
                this.getModule("dialog").show({
                    type: "warn",
                    text: "是否保存修改！",
                    cancel: hide => {
                        hide();
                    },
                    confirm: hide => {
                        this.getModule("back").save(() => {
                            this.prevDataMD5 = currMD5;
                            hide();
                        });
                    }
                });
                return false
            }
        };
    }

    loadData(sceneId = null, data = null) {
        if (!sceneId) {
            this.sceneId = null;
            let name = "新建页";
            this.scene = {
                page: {
                    name: name,
                    size: {
                        width: 1920,
                        height: 1080
                    },
                    background: {
                        color: "",
                        image: "",
                        fill: 0
                    },
                    //页面填充方式
                    fill: 0,
                    //TODO 翻页
                    flipOver: 1,
                    //TODO 封面
                    cover: "",
                    //TODO 描述
                    comment: "xxx"
                },
                //当前的场景的组件
                components: []
            };
            //执行新建操作
            this.getModule("back").save(() => {
                //自动增加
                this.getModule("canvas").autoAddNewSheet();
            });
        } else {
            this.scene = data;
            this.sceneId = sceneId;
        }

        //监听数据变化，用于推出时保存

        //console.log(this.scene);

        //TODO 计算md5，用于检测是否产生了修改，可能产生误判
        this.prevDataMD5 = md5(JSON.stringify(this.scene));

        //加载场景
        this.getModule("canvas").loadScene();
        this.getModule("edit").initPagePanel();
    }

    getSceneId() {
        return this.sceneId;
    }

    setSceneId(sceneId) {
        this.sceneId = sceneId;
    }

    //关闭数据编辑器
    dateEditClose() {
        cp.hide(this.editDom)
    }

    //显示数据编辑器
    dataEditShow() {
        cp.show(this.editDom);
        //位置
        let {ww, wh} = cp.windowSize();
        let {width, height} = cp.domSize(this.containerDom);
        let left = (ww - width) / 2,
            top = (wh - height) / 2;
        cp.css(this.containerDom, {
            top: top + "px",
            left: left + "px"
        })
    }

    _dateEditTitleMousedown() {
        //获取鼠标位置
        let x0 = window.event.screenX,
            y0 = window.event.screenY;

        let dLeft = parseInt(this.containerDom.style.left),
            dTop = parseInt(this.containerDom.style.top);
        //绑定移动事件
        this.editDom.onmousemove = () => {
            //获取鼠标位置
            let x = window.event.screenX,
                y = window.event.screenY;
            //计算移动距离
            let left = x - x0,
                top = y - y0;
            //移动
            this.containerDom.style.left = dLeft + left + "px";
            this.containerDom.style.top = dTop + top + "px";
        };

        this.editDom.onmouseup = () => {
            this.editDom.onmousemove = null;
            this.editDom.onmouseup = null
        }
    }

    //页面数据
    getPageData() {
        return this.scene.page
    }

    getComponentDataList() {
        return this.scene.components;
    }

    //获取配置数据
    getComponentData(id) {
        let compontent = null;
        this.scene.components.some(v => {
            if (v.id === id) {
                compontent = v;
                return true
            }
        });
        return compontent
    }

    deleteComponentData(id) {
        this.scene.components.some((v, i) => {
            if (v.id === id) {
                this.scene.components.splice(i, 1);
                return true
            }
        });
    }

    prevComponentData(id) {
        let compontent = null;
        this.scene.components.some((v, i) => {
            if (v.id === id) {
                if (i === this.scene.components.length - 1) {
                    compontent = v;
                } else {
                    compontent = this.scene.components[i + 1];
                }
                return true
            }
        });
        return compontent
    }

    nextComponentData(id) {
        let compontent = null;
        this.scene.components.some((v, i) => {
            if (v.id === id) {
                if (i === 0) {
                    compontent = v;
                } else {
                    compontent = this.scene.components[i - 1];
                }
                return true
            }
        });
        return compontent
    }

    changeComponentDataPosition(curr, dist) {
        let distItem = null;
        let distIndex = null;
        this.scene.components.some((v, i) => {
            if (v.id === dist) {
                distItem = v;
                distIndex = i;
                return true
            }
        });

        let currItem = null;
        let currIndex = null;
        this.scene.components.some((v, i) => {
            if (v.id === curr) {
                currItem = v;
                currIndex = i;
                return true
            }
        });

        if (distItem === null || distIndex === null || currItem === null || currIndex === null) {
            return;
        }

        this.scene.components[distIndex] = currItem;
        this.scene.components[currIndex] = distItem;
    }

    getSceneById(sid) {
        cp.ajax(CONF.ServerAddr + "/scene/getById", {
            data: {
                id: sid
            },
            success: res => {
                if (res.code === 0) {
                    //加载场景，赋值给了主页面
                    this.loadData(sid, JSON.parse(res.data.data));
                } else {
                    console.error(res)
                }
            }
        })
    }
}