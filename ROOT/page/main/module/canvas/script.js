class Module {
    DOM() {
        this.tooBarDom = cp.query('.tool-bar', DOMAIN);
        this.rangeBoxDom = cp.query('.range-box', this.tooBarDom);
        this.rangeBoxCheckboxDom = cp.query('.checkbox', this.rangeBoxDom);
        this.rangeBoxNumberDom = cp.query('.number', this.rangeBoxDom);
        this.rangeBoxRangeDom = cp.query('.range', this.rangeBoxDom);
        this.axisBoxDom = cp.query('.axis-box', this.tooBarDom);
        this.gridBoxDom = cp.query('.grid-box', this.tooBarDom);
        //鹰眼
        this.overviewBoxDom = cp.query('.overview-box', this.tooBarDom);
        this.viewDom = cp.query('.view', this.overviewBoxDom);
        this.viewInnerDom = cp.query('.inner', this.viewDom);
        this.viewGlassDom = cp.query('.glass', this.viewDom);
        //拼缝
        this.riftBoxDom = cp.query('.rift-box', this.tooBarDom);
        this.riftBoxNumberDoms = cp.query('.number', this.riftBoxDom, true);
        this.axisLineDoms = cp.query('.axis-line', DOMAIN, true);
        this.containerDom = cp.query('.container', DOMAIN);
        //右键菜单
        this.rightMenuDom = cp.query('.right-menu', DOMAIN);
        //sheet
        this.sheetDom = cp.query('.sheet', DOMAIN);
        this.sheetInnerDom = cp.query('.inner', this.sheetDom);
    }

    INIT() {
        this.sliceIndex = 10;

        this.sceneDom = null;
        this.scale = 1;
        this.autoScale = true;
        this.riftDomArr = [];
        this.sceneMargin = 10;
        this.gridDom = null;
        this.ctrlMousewheel = false;

        this.overviewOriginalScale = null;

        //获取数据，加载场景
        this.getSceneList();
    }

    EVENT() {
        cp.on(".right-menu", DOMAIN, 'blur', () => this.hideRightMenu());
        //移动标尺线
        cp.on('.line-X', DOMAIN, 'drag', t => {
        });
        cp.on('.line-Y', DOMAIN, 'drag', t => {
        });
        //标尺线
        cp.on('.checkbox', this.axisBoxDom, 'click', t => this.toggleAxisLine(t));
        //网格子
        cp.on('.checkbox', this.gridBoxDom, 'click', t => this.toggleGrid(t));
        //屏幕拼缝
        cp.on('.checkbox', this.riftBoxDom, 'click', t => this.toggleRift(t));
        cp.on('.number', this.riftBoxDom, 'change', () => this.changeRift());
        //缩放
        cp.on('.number', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.range', this.rangeBoxDom, 'change', t => this.changeRange(t));
        cp.on('.checkbox', this.rangeBoxDom, 'click', t => this.changeScale(t));
        //鹰眼
        cp.on('.checkbox', this.overviewBoxDom, 'click', () => this.changeOverview());
        cp.on('.glass', this.overviewBoxDom, 'drag', (_, __, top, left) => this.moveOverview(top, left));

        //滚轮缩放
        document.onkeydown = e => this.keydownScale(e);
        document.onkeyup = e => this.keyupScale(e);
        //滚轮
        cp.on('.container', DOMAIN, 'mousewheel', (_, __, e) => this.mousewheelScale(e));
        //滚动条反馈鹰眼
        cp.on('.container', DOMAIN, 'scroll', () => this.changeOverview());

        //删除
        cp.on('.delete', this.rightMenuDom, 'click', t => this.deleteSlice(t));
        //上移
        cp.on('.move-up', this.rightMenuDom, 'click', t => this.moveUpSlice(t));
        //下移
        cp.on('.move-down', this.rightMenuDom, 'click', t => this.moveDownSlice(t));

        //新建sheet
        cp.on('.add-sheet', this.sheetDom, 'click', t => this.addNewSheet(t));
        cp.on('.item', this.sheetInnerDom, 'click', t => this.loadSheet(t));
    }

    moveOverview(top, left) {
        //容器位置
        let iTop = parseInt(this.viewInnerDom.style.top),
            iLeft = parseInt(this.viewInnerDom.style.left);
        let x = left - iLeft,
            y = top - iTop;
        let pageData = this.APP.getPageData();
        let size = cp.domSize(this.viewInnerDom);
        let wScale = size.width / pageData.size.width / this.scale,
            hScale = size.height / pageData.size.height / this.scale;
        this.containerDom.scrollTop = y / hScale;
        this.containerDom.scrollLeft = x / wScale;
    }

    dependDomEvent() {
        //slice
        cp.on('.slice', this.sceneDom, 'drag', t => this.dragSlice(t));
        cp.on('.slice', this.sceneDom, 'resize', t => this.resizeSlice(t));
        cp.on(".slice", this.sceneDom, 'mousedown', t => this.toggleActive(t));
        //右键
        cp.on(".slice", this.sceneDom, 'mousedown', (t, _, e) => this.showRightMenu(t, _, e));
    }

    changeOverview() {
        if (!cp.query('.checkbox', this.overviewBoxDom).checked) {
            cp.hide(this.viewDom);
            return;
        }
        //设置大小，等比居中
        let pageData = this.APP.getPageData();
        let size = cp.autoSize({
            w: 150,
            h: 150
        }, {
            w: pageData.size.width,
            h: pageData.size.height
        }, 5);
        cp.css(this.viewInnerDom, {
            width: size.w + "px",
            height: size.h + "px",
            top: size.t + "px",
            left: size.l + "px"
        });

        if (this.overviewOriginalScale < this.scale) {
            //设置眼睛
            let cSize = cp.domSize(this.containerDom);
            let top = this.containerDom.scrollTop,
                left = this.containerDom.scrollLeft;

            let wScale = size.w / pageData.size.width / this.scale,
                hScale = size.h / pageData.size.height / this.scale;

            cp.css(this.viewGlassDom, {
                width: cSize.width * wScale + "px",
                height: cSize.height * hScale + "px",
                top: size.t + top * hScale + "px",
                left: size.l + left * wScale + "px"
            });
            cp.show(this.viewGlassDom);
        } else {
            cp.hide(this.viewGlassDom);
        }
        cp.show(this.viewDom);
    }

    /**
     * 上移一层
     * @param target
     */
    moveUpSlice(target) {
        //当前层
        let currData = this.APP.getComponentData(this.rightClickId);
        let currIndex = currData.index;
        let currDom = cp.query("#slice_" + this.rightClickId, this.sceneDom);

        //找到上一层
        let prevData = this.APP.prevComponentData(this.rightClickId);
        let prevId = prevData.id;
        let prevDom = cp.query("#slice_" + prevId, this.sceneDom);
        let prevIndex = prevData.index;

        //不最顶层
        if (prevId !== this.rightClickId) {
            //交换slice层
            cp.css(currDom, {
                zIndex: prevIndex
            });
            cp.css(prevDom, {
                zIndex: currIndex
            });

            //交换数据
            currData.index = prevIndex;
            prevData.index = currIndex;
            this.APP.changeComponentDataPosition(this.rightClickId, prevId);

            //交换左边图层
            MODULE("coverage").reloadList(this.rightClickId);
        }
        target.parentNode.blur();
    }

    /**
     * 下移一层
     * @param target
     */
    moveDownSlice(target) {
        //当前层
        let currData = this.APP.getComponentData(this.rightClickId);
        let currIndex = currData.index;
        let currDom = cp.query("#slice_" + this.rightClickId, this.sceneDom);

        //找到上一层
        let nextData = this.APP.nextComponentData(this.rightClickId);
        let nextId = nextData.id;
        let nextDom = cp.query("#slice_" + nextId, this.sceneDom);
        let nextIndex = nextData.index;

        //不最底层
        if (nextId !== this.rightClickId) {
            //交换slice层
            cp.css(currDom, {
                zIndex: nextIndex
            });
            cp.css(nextDom, {
                zIndex: currIndex
            });

            //交换数据
            currData.index = nextIndex;
            nextData.index = currIndex;
            this.APP.changeComponentDataPosition(this.rightClickId, nextId);

            //交换左边图层
            MODULE("coverage").reloadList(this.rightClickId);
        }
        target.parentNode.blur();
    }


    deleteSlice(target) {
        //删除Slice
        cp.remove(cp.query("#slice_" + this.rightClickId, this.sceneDom));
        //删除左侧图层
        MODULE("coverage").delete(this.rightClickId);
        //删除数据
        this.APP.deleteComponentData(this.rightClickId);
        //删除右侧编辑器
        MODULE("edit").deleteComponentEdit();
        target.parentNode.blur();
    }

    showRightMenu(target, _, evt) {
        if (evt.button === 2) {
            let x = evt.clientX - 150,
                y = evt.clientY - 30;
            cp.css(this.rightMenuDom, {
                top: y + "px",
                left: x + "px"
            });
            cp.show(this.rightMenuDom);
            setTimeout(() => this.rightMenuDom.focus(), 100);
            this.rightClickId = target.id.split("_")[1];
        }
    }

    hideRightMenu() {
        cp.hide(this.rightMenuDom)
    }

    /**
     * 拖拽
     * @param target
     */
    dragSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.position.top = parseInt(target.style.top);
        component.position.left = parseInt(target.style.left);
        //改变右侧的配置
        MODULE("edit").changePosition(id);
    }

    /**
     * 改变大小
     * @param target
     */
    resizeSlice(target) {
        let id = target.id.split("_")[1];
        //改变保存的数据
        let component = this.APP.getComponentData(id);
        component.size.width = parseInt(target.style.width);
        component.size.height = parseInt(target.style.height);
        //改变右侧的配置
        MODULE("edit").changeSize(id);
    }

    /**
     * 改变缩放
     * @param target
     */
    changeScale(target) {
        let checked = target.checked;
        if (checked) {
            //开启缩放
            cp.removeClass([this.rangeBoxNumberDom, this.rangeBoxRangeDom], 'disable');
            this.autoScale = false;
        } else {
            //还原缩放
            cp.addClass([this.rangeBoxNumberDom, this.rangeBoxRangeDom], 'disable');
            this.autoScale = true;
            this.sceneSize();
        }
    }

    //按住ctrl
    keydownScale(e) {
        if (e.key === "Control") {
            this.ctrlMousewheel = true
        }
    }

    keyupScale(e) {
        if (e.key === "Control") {
            this.ctrlMousewheel = false
        }
    }

    //滚轮
    mousewheelScale(e) {
        //按住ctrl
        if (!this.ctrlMousewheel) return;

        //开启手动
        this.rangeBoxCheckboxDom.checked = true;
        this.changeScale(this.rangeBoxCheckboxDom);
        //this.autoScale = false;
        //获取缩放级别
        let scale = this.rangeBoxNumberDom.value;
        e.wheelDelta > 0 ? ++scale : --scale;
        if (scale > 100) {
            scale = 100;
        }
        if (scale < 1) {
            scale = 1;
        }

        this.rangeBoxNumberDom.value = scale;
        this.rangeBoxRangeDom.value = scale;

        this.sceneSize(scale / 100);
    }

    /**
     * 改变缩放范围
     * @param target
     */
    changeRange(target) {
        let value = target.value;
        //改变数字
        cp.hasClass(target, 'number')
            ? this.rangeBoxRangeDom.value = value
            : this.rangeBoxNumberDom.value = value;

        //改变缩放
        this.sceneSize(value / 100);

        //改变鹰眼
        this.changeOverview();
    }

    /**
     * 加载范围
     */
    loadRange() {
        this.rangeBoxNumberDom.value = parseInt(this.scale * 100);
        this.rangeBoxRangeDom.value = parseInt(this.scale * 100);
    }

    /**
     * 改变拼缝
     */
    changeRift() {
        let row = this.riftBoxNumberDoms.item(0).value,
            column = this.riftBoxNumberDoms.item(1).value;
        this.loadRift(row, column);
    }

    /**
     * 切换拼缝
     * @param target
     */
    toggleRift(target) {
        let checked = target.checked;
        if (checked) {
            cp.show(this.riftDomArr);
            cp.removeClass(this.riftBoxNumberDoms, 'disable')
        } else {
            cp.hide(this.riftDomArr);
            cp.addClass(this.riftBoxNumberDoms, 'disable')
        }
    }

    /**
     * 辅助线
     * @param target
     */
    toggleAxisLine(target) {
        let checked = target.checked;

        if (checked) {
            cp.show(this.axisLineDoms);
            if (!this.axisLineDoms[0].style.top) {
                let size = cp.domSize(DOMAIN);
                cp.css(this.axisLineDoms[0], {
                    top: size.height / 2 + 'px'
                });
                cp.css(this.axisLineDoms[1], {
                    left: size.width / 2 + 'px'
                })
            }
        } else {
            cp.hide(this.axisLineDoms);
        }
    }

    /**
     * 网格
     * @param target
     */
    toggleGrid(target) {
        let checked = target.checked;
        if (checked) {
            cp.show(this.gridDom);
        } else {
            cp.hide(this.gridDom);
        }
    }

    /**
     * 加载场景
     */
    loadScene() {
        //删除现有的场景
        cp.remove(cp.query(".scene", this.containerDom));
        //删除现有的图层
        MODULE("coverage").empty();
        this.sliceIndex = 10;
        this.scale = 1;
        this.autoScale = true;
        this.riftDomArr = [];

        //加载场景
        this.sceneDom = cp.createDom();
        cp.addClass(this.sceneDom, 'scene');
        let pageData = this.APP.getPageData();
        //console.log(pageData);
        let sceneStyle = {
            width: pageData.size.width + 'px',
            height: pageData.size.height + 'px',
        };
        if(pageData.background.color){
            sceneStyle["backgroundColor"] = pageData.background.color;
        }
        /*if(pageData.background.image){
            sceneStyle["backgroundImage"] = pageData.background.image;
        }*/
        cp.css(this.sceneDom, sceneStyle);
        this.sceneSize(this.autoScale ? null : this.scale);
        cp.append(this.containerDom, this.sceneDom);

        //重新计算大小
        window.onresize = () => this.sceneSize(this.autoScale ? null : this.scale);
        //事件
        this.dependDomEvent();

        //加载其他组件
        this.loadGridDom();
        this.loadRift();
        this.loadRange();

        //加载组件
        this.loadComponent(this.APP.scene.components);
        //
        this.setBackgroundImage();
        this.setBackgroundFill();
    }


    //加载来的现成的数据
    loadComponent(loadedComponentsData) {
        loadedComponentsData.forEach(v => {
            //TODO 这里产生了循环内的请求
            //加载组件，但是不用默认数据，用这个替换
            MODULE("menu").getComponent(v.name.replace("-", "/"), v);
        })
    }

    /**
     * 加载网格
     */
    loadGridDom() {
        this.gridDom = cp.createDom();
        cp.addClass(this.gridDom, ['grid', 'hide']);
        cp.css(this.gridDom, {
            backgroundSize: (20 * (1 / this.scale)) + 'px ' + (20 * (1 / this.scale)) + 'px'
        });
        cp.append(this.sceneDom, this.gridDom);
    }

    /**
     * 加载拼缝
     * @param row
     * @param column
     */
    loadRift(row = 0, column = 0) {
        row++;
        column++;
        //清除拼缝
        cp.remove(this.riftDomArr);
        this.riftDomArr = [];
        let pageData = this.APP.getPageData();
        //重新建立
        if (row > 1) {
            let rowPlus = pageData.size.height / row;
            let rowDom = cp.createDom();
            cp.addClass(rowDom, 'row');
            for (let r = 1; r < row; ++r) {
                let newRowDom = rowDom.cloneNode();
                cp.css(newRowDom, {
                    top: rowPlus * r + 'px',
                    height: 1 / this.scale + 'px'
                });
                cp.append(this.sceneDom, newRowDom);
                this.riftDomArr.push(newRowDom);
            }
        }

        if (column > 1) {
            let columnPlus = pageData.size.width / column;
            let columnDom = cp.createDom();
            cp.addClass(columnDom, 'column');
            for (let c = 1; c < column; ++c) {
                let newColumnDom = columnDom.cloneNode();
                cp.css(newColumnDom, {
                    left: columnPlus * c + 'px',
                    width: 1 / this.scale + 'px'
                });
                cp.append(this.sceneDom, newColumnDom);
                this.riftDomArr.push(newColumnDom);
            }
        }
    }

    /**
     * 改变大小
     * @param width
     * @param height
     */
    setSize(width, height) {
        this.autoScale = true;

        let pageData = this.APP.getPageData();

        pageData.size.width = width;
        pageData.size.height = height;

        cp.css(this.sceneDom, {
            width: pageData.size.width + 'px',
            height: pageData.size.height + 'px',
        });

        this.sceneSize();
    }

    /**
     * 场景大小
     * @param scale
     */
    sceneSize(scale = null) {
        //获取容器大小
        let {width, height} = cp.domSize(this.containerDom);

        let size = {};

        let pageData = this.APP.getPageData();

        //不指定缩放大小，
        if (scale === null && this.autoScale) {
            size = cp.autoSize({
                w: width, h: height
            }, {
                w: parseInt(pageData.size.width) + 2, h: parseInt(pageData.size.height) + 2
            }, this.sceneMargin);
        } else {
            //指定缩放大小
            size.scale = scale;
            //缩放后的感官大小
            let sWidth = pageData.size.width * scale,
                sHeight = pageData.size.height * scale;
            //中心缩放
            size.l = (width - sWidth) / 2;
            size.t = (height - sHeight) / 2;
            if (width < sWidth) {
                size.l = 0;
            }

            if (height < sHeight) {
                size.t = 0;
            }
        }

        if (scale === null) {
            this.overviewOriginalScale = size.scale;
        }


        this.scale = size.scale;

        //适应分割线的宽度
        this.riftDomArr.forEach(v => v.style.width
            ? v.style.width = 1 / this.scale + 'px'
            : v.style.height = 1 / this.scale + 'px');

        //适应网格
        if (this.gridDom)
            this.gridDom.style.backgroundSize = (20 / this.scale) + 'px ' + (20 / this.scale) + 'px';

        //返回大小
        cp.css(this.sceneDom, {
            transform: `scale(${this.scale}) translate(${size.l / this.scale}px,${size.t / this.scale}px)`,
            transformOrigin: "top left",
            //适应背景大小
            backgroundSize: (20 / this.scale) + 'px ' + (20 / this.scale) + 'px'
        });

        this.rangeBoxRangeDom.value = this.rangeBoxNumberDom.value = this.scale.toFixed(2) * 100;
    }

    /**
     * 添加组件外壳
     * @param data 组件容器的数据
     * @param html  组件容器的html
     * @param single 是否选中
     */
    addSlice(data, html, single = false) {
        ++this.sliceIndex;
        //增加一片
        let sliceDom = cp.createDom("div", {
            id: "slice_" + data.id,
            class: "slice slice-" + data.name + `${data.background ? data.background.fill === "0" ? " fillBg" : " centerBg" : ""}`
        });
        data.index = this.sliceIndex;

        let style = {
            top: data.position.top + "px",
            left: data.position.left + "px",
            width: data.size.width + "px",
            height: data.size.height + "px",
            zIndex: this.sliceIndex,
            //backgroundColor: data.background.color//,
            //fontSize: data.font.size + "px",
            //fontFamily: data.font.family,
            //color: data.font.color
        };

        if (data.background) {
            style["backgroundColor"] = data.background.color;
            if (data.background.image) {
                style["backgroundImage"] = "url('" + data.background.image.split("||")[1] + "')"
            }
        }

        if (data.font) {
            style["fontSize"] = data.font.size + "px";
            style["fontFamily"] = data.font.family;
            style["color"] = data.font.color;
        }

        //设置外壳配置
        cp.css(sliceDom, style);

        //把html放到容器里
        cp.html(sliceDom, html);
        cp.append(this.sceneDom, sliceDom);
        //执行
        //console.log(cp.componentEntity.get(data.id));
        //图层
        MODULE("coverage").addLayer(data);
        single && this.toggleActive(sliceDom);
    }

    /**
     * 设置背景颜色
     */
    setBackgroundColor() {
        let pageData = this.APP.getPageData();
        cp.css(this.sceneDom, {
            backgroundColor: pageData.background.color
        });
    }

    /**
     * 设置背景图片
     */
    setBackgroundImage() {
        let pageData = this.APP.getPageData();

        //是否有背景图
        let bgDom = cp.query(".sceneBg", this.sceneDom);

        if (pageData.background.image === "") {
            bgDom && cp.remove(bgDom);
            return;
        }

        if (!bgDom) {
            //背景图容器
            bgDom = cp.createDom("div", {
                class: "sceneBg centerWrap"
            });
        } else {
            cp.empty(bgDom)
        }

        //图片
        let image = new Image();
        image.src = pageData.background.image;

        if (pageData.background.fill === 0) {//自适应
            cp.attr(image, {
                "style": null
            })
        } else {//填充
            cp.css(image, {
                width: "100%",
                height: "100%"
            })
        }

        //添加元素
        cp.append(bgDom, image);
        cp.append(this.sceneDom, bgDom);
    }

    /**
     * 背景填充
     */
    setBackgroundFill() {
        let bgDom = cp.query(".sceneBg", this.sceneDom);
        if (!bgDom) {
            //TODO 无图片
            return
        }
        let image = cp.query("IMG", bgDom);
        let pageData = this.APP.getPageData();
        if (pageData.background.fill === "0") {//自适应
            cp.attr(image, {
                style: null
            })
        } else {//填充
            cp.css(image, {
                display: "block",
                width: "100%",
                height: "100%"
            })
        }
    }


    /**
     * 切换激活状态
     * @param target
     */
    toggleActive(target) {
        let idstr = target.id;
        let id = idstr.split("_")[1];
        cp.toggleActive(target);
        MODULE("coverage").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    /**
     * 根据id切换激活状态
     * @param id
     */
    toggleActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.toggleActive(sliceDom)
    }

    /**
     * 根据id移除激活状态
     * @param id
     */
    removeActiveById(id) {
        let sliceDom = cp.query("#slice_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }

    /**
     * 获取场景列表，用于切换场景
     */
    getSceneList() {
        cp.ajax(CONF.ServerAddr + "/scene/getListByProject", {
            data: {
                projectId: localStorage.getItem("pid")
            },
            success: res => {
                if (res.code === 0) {
                    if (res.data.length === 0) {
                        //设置默认数据，赋值给了主页面
                        this.APP.loadData();
                    } else {
                        //已经有的场景
                        //TODO 场景切换组件
                        let html = '';
                        res.data.forEach((v, i) => {
                            html += `
                                 <div class="item ellipsis ${!i ? "active" : ""}" data-id="${v.id}">
                                    ${v.name}
                                </div>
                            `;
                        });
                        cp.html(this.sheetInnerDom, html);
                        //获取第一个数据
                        this.APP.getSceneById(res.data[0].id);
                    }
                } else {
                    console.error(res)
                }
            }
        })
    }

    /**
     * 新建工程后自动新建的场景
     */
    autoAddNewSheet() {
        cp.removeActive(cp.query(".active", this.sheetInnerDom));
        //新的或者空的场景
        cp.html(this.sheetInnerDom,
            `<div class="item ellipsis active" data-id="${this.APP.getSceneId()}">${this.APP.scene.page.name}</div>`, "afterbegin");
    }

    /**
     * 手动点击新建
     */
    addNewSheet() {
        this.APP.loadData();
    }

    /**
     *
     * @param target
     */
    loadSheet(target) {
        if (cp.hasActive(target)) {
            return
        }
        let id = cp.getData(target);
        cp.toggleActive(target);
        this.APP.getSceneById(id);
    }
}