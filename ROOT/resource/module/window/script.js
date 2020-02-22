class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        //cp.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {
        this._sheetStyle();
    }

    show(dom, open = null, close = null) {
        //打开时候执行的函数
        typeof open === "function" && open(dom);
        if (cp.hasClass(dom, 'window-wrap')) {
            cp.show(dom);
            return
        }
        cp.addClass(dom, ["window-wrap", "centerWrap"]);
        //加入关闭
        let closeDom = cp.createDom("div", {
            class: "window-close iconfont"
        });
        cp.html(closeDom, "&#xe6f4;");
        let titleDom = cp.query(".window-title", dom);
        cp.append(titleDom, closeDom);
        //绑定关闭事件
        closeDom.onclick = () => {
            typeof close === "function" && close(dom);
            this.hide(dom);
        };
        cp.show(dom);
    }

    hide(dom, close = null) {
        cp.hide(dom);
        typeof close === "function" && close();
    }

    //内置样式
    _sheetStyle() {
        cp.setStrSheet(`
            .window-wrap{
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                z-index: 99;
                position: absolute;
                background: var(--background8);
            }
            .window-wrap > .window-container{
                background: var(--background2);
                border: var(--border);
            }
            .window-wrap > .window-container >.window-title{
                width: calc(100% + 2px);
                height: 23px;
                line-height: 23px;
                font-size: 14px;
                margin:-23px 0 0 -1px;
                position: relative;
                text-align: center;
                border: var(--border);
                background: var(--background);
            }
            .window-wrap > .window-container >.window-title > .window-close{
                width: 23px;
                height: 23px;
                line-height: 23px;
                text-align: center;
                left:0;
                top:0;
                position: absolute;
                color:red;
                cursor:pointer;
            }`);
    }
}