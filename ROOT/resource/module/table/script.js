class Module {
    DOM() {
        this.optionDom = cp.query('.option', DOMAIN);

        this.tbodyDom = cp.query('.tbody', DOMAIN);
        this.leftDom = cp.query(".left", this.tbodyDom);
        this.titleDom = cp.query(".title", this.tbodyDom);
        this.rowsDom = cp.query(".rows", this.tbodyDom);

        this.tmenuDom = cp.query(".tmenu", DOMAIN);
    }

    INIT() {
        this.tempChange = null;
        this.tempRightClickCell = null;
        this.onchange = null;
        this.tempActive = null;
        this._sheetStyle()
    }

    //内置样式
    _sheetStyle() {
        cp.setSheet('#' + NAME, {
            height: "100%"
        });
    }

    EVENT() {
        //复合滚动函数
        cp.on('.rows', this.tbodyDom, 'scroll', t => this.scrollTable(t));
        //选中列
        cp.on('.cell', this.titleDom, 'focus', t => this.focusColumn(t));
        //选中行
        cp.on('.cell', this.leftDom, 'focus', t => this.focusRow(t));
        //选中单元格
        cp.on('.cell', this.rowsDom, 'focus', t => this.focusCell(t));
        //失去焦点
        cp.on('.cell', this.tbodyDom, 'blur', t => this.blurCell(t));

        //增加行
        cp.on('.addRow', this.optionDom, 'click', () => this.addRow());
        //增加列
        cp.on('.addColumn', this.optionDom, 'click', () => this.addColumn());
        //删除选中
        cp.on('.delete', this.optionDom, 'click', () => this.deleteCell());
        //右键
        cp.on('.cell', this.rowsDom, 'rightClick', t => this.rightClick(t));
        cp.on('.tbody', DOMAIN, 'click', t => this.menuHide());
        //cp.on('.tmenu', DOMAIN, 'blur', t => this.menuHide(t));

        //颜色
        cp.on('.color', this.tmenuDom, 'change', t => this.getColor(t));
        cp.on('.file', this.tmenuDom, 'change', t => this.getFile(t));
    }

    menuHide() {
        cp.hide(this.tmenuDom)
    }

    getColor(target) {
        let color = target.value;
        cp.text(this.tempRightClickCell, color);
        cp.css(this.tempRightClickCell, {
            color: color
        });
        this.tempRightClickCell = null;
        this.changeData();
        this.menuHide();
    }

    getFile(target) {
        MODULE("upload").upload(target, res => {
            let value = res.type + "||" + res.url;
            cp.text(this.tempRightClickCell, value);
            this.tempRightClickCell = null;
            this.changeData();
            this.menuHide();
        });
    }

    changeData() {
        let data = this.getData();
        this.onchange && typeof this.onchange === "function" && this.onchange(data);
    }

    rightClick(target) {
        //显示表格右键菜单
        let {top, left} = cp.position(target);
        let {width, height} = cp.domSize(target);
        cp.css(this.tmenuDom, {
            top: top + height / 2 + "px",
            left: left + width / 2 + "px"
        });
        cp.show(this.tmenuDom);
        this.tempRightClickCell = target
    }

    deleteCell() {
        this.tempActive && this.tempActive.forEach(v => {
            if (cp.query(".cell", v.parentNode, true).length === 1
                && cp.hasClass(v.parentNode, "row")) {
                cp.remove(v.parentNode)
            } else {
                cp.remove(v)
            }
        });
        this.tempActive = null;
        this.changeData();
    }

    addRow() {
        //获取几列
        let count = cp.query(".cell", this.titleDom, true).length;
        let rowHtml = `<div class="row">`;
        for (let i = 0; i < count; i++)
            rowHtml += `<div class="cell" tabindex="-1"></div>`;
        rowHtml += `</div>`;
        cp.html(this.rowsDom, rowHtml, "beforeend");
        cp.html(this.leftDom, `<div class="cell" tabindex="-1"></div>`, "beforeend");
    }

    addColumn() {
        cp.query(".row", this.rowsDom, true).forEach(v =>
            cp.html(v, `<div class="cell" tabindex="-1"></div>`, "beforeend"));
        cp.html(this.titleDom, `<div class="cell" tabindex="-1"></div>`, "beforeend");
    }

    focusColumn(target) {
        cp.addActive(target);
        cp.query(".active", this.rowsDom, true).forEach(v => cp.removeActive(v));
        let index = cp.domIndex(target);
        cp.query(".row", this.rowsDom, true).forEach(v => cp.addActive(cp.query(".cell", v, true)[index]));
        cp.attr(target, {
            contenteditable: "true"
        });
        this.tempChange = target.innerText
    }

    focusRow(target) {
        cp.addActive(target);
        cp.query(".active", this.titleDom, true).forEach(v => cp.removeActive(v));
        let index = cp.domIndex(target);
        cp.query(".cell", cp.query(".row", this.rowsDom, true)[index], true).forEach(v => cp.addActive(v));
        cp.attr(target, {
            contenteditable: "true"
        });
        this.tempChange = target.innerText
    }

    focusCell(target) {
        cp.query(".active", this.titleDom, true).forEach(v => cp.removeActive(v));
        //列
        let index = cp.domIndex(target);
        cp.query(".row", this.rowsDom, true).forEach(v => cp.addActive(cp.query(".cell", v, true)[index]));
        cp.addActive(cp.query(".cell", this.titleDom, true)[index]);

        //行变色
        let parent = target.parentNode;
        index = cp.domIndex(parent);
        cp.query(".cell", cp.query(".row", this.rowsDom, true)[index], true).forEach(v => cp.addActive(v));
        cp.addActive(cp.query(".cell", this.leftDom, true)[index]);

        //可编辑
        cp.attr(target, {
            contenteditable: "true"
        });
        this.tempChange = target.innerText
    }

    blurCell(target) {
        this.tempActive = cp.query(".active", this.tbodyDom, true);
        cp.query(".active", this.rowsDom, true).forEach(v => {
            cp.removeActive(v);
            cp.attr(v, {
                contenteditable: null
            })
        });
        let text = target.innerText;
        if (this.tempChange !== null && text !== this.tempChange) {
            this.changeData();
        }
        this.tempChange = null;
        //预备删除
        setTimeout(() => this.tempActive = null, 500)
    }

    scrollTable(target) {
        //let target = evt.target;
        this.leftDom.scrollTop = target.scrollTop;
        this.titleDom.scrollLeft = target.scrollLeft
    }

    init(data = null, onchange = null) {
        this.setData(data);
        this.onchange = onchange;
    }

    setData(data) {
        //清空数据
        cp.empty(this.titleDom);
        cp.empty(this.rowsDom);
        cp.empty(this.leftDom);
        //加载数据
        if (data == null) {
            data = [
                ["", "周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                ["吃饭", 1, 2, 3, 4, 5, 6, 7],
                ["睡觉", 1, 2, 3, 4, 5, 6, 7],
                ["发呆", 1, 2, 3, 4, 5, 6, 7],
                ["买菜", 1, 2, 3, 4, 5, 6, 7],
                ["做饭", 1, 2, 3, 4, 5, 6, 7],
                ["打扫卫生", 1, 2, 3, 4, 5, 6, 7],
                ["玩手机", 1, 2, 3, 4, 5, 6, 7],
                ["陪女友", 1, 2, 3, 4, 5, 6, 7],
                ["逗猫子", 1, 2, 3, 4, 5, 6, 7],
                ["遛狗子", 1, 2, 3, 4, 5, 6, 7],
            ];
        }

        let titleHtml = ``;
        let rowHtml = ``;
        let leftHtml = "";
        data.forEach((v, i) => {
            if (!i) {
                data[i].forEach((v, i) => {
                    titleHtml += i ? `<div class="cell" tabindex="-1">${v}</div>` : ""
                });
            } else {
                rowHtml += `<div class="row">`;
                v.forEach((vv, ii) => {
                    if (ii) {
                        rowHtml += `<div class="cell" tabindex="-1">${vv}</div>`;
                    } else {
                        leftHtml += `<div class="cell" tabindex="-1">${vv}</div>`;
                    }
                });
                rowHtml += `</div>`;
            }
        });
        cp.html(this.titleDom, titleHtml);
        cp.html(this.rowsDom, rowHtml, "beforeend");
        cp.html(this.leftDom, leftHtml, "beforeend")
    }

    getData() {
        let data = [];
        let title = [""];
        cp.query(".cell", this.titleDom, true).forEach(v => title.push(v.innerText));
        data.push(title);
        let leftCellDoms = cp.query(".cell", this.leftDom, title);
        cp.query(".row", this.rowsDom, true).forEach((v, i) => {
            let row = [leftCellDoms[i].innerText];
            cp.query(".cell", v, true).forEach(vv => row.push(vv.innerText));
            data.push(row)
        });
        return data
    }
}