class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        cp.on('.enter', DOMAIN, 'click', t => this.enter(t));
        cp.on('.delete', DOMAIN, 'click', t => this.delete(t));
    }

    INIT() {
        this.defaultSize = 180;
        this.autoSize();
        this.loadItem();
        window.onresize = () => this.autoSize();

        /*setTimeout(v => {
            MODULE("dialog").show({
                type:"loading",
                text:"正在上传"
            })
        }, 1000)*/

    }

    delete(target) {
        //确认
        MODULE("dialog").show({
            type: "warn",
            text: "确定要删除?",
            confirm: close => {
                let p = cp.parent(target, "item");
                let pid = cp.getData(p);
                cp.ajax(CONF.ServerAddr + "/project/delete", {
                    data: {
                        project: pid
                    },
                    success: res => {
                        if (res.code === 0) {
                            //删除dom
                            cp.remove(p);
                            //删除localStorage
                            localStorage.removeItem("pid");
                            close();
                        } else {
                            console.error(res)
                        }
                    }
                })
            },
            cancel: close => close()
        });
    }

    loadItem() {
        cp.ajax(CONF.ServerAddr + "/project/list", {
            success: res => {
                if (res.code === 0) {
                    let html = '';
                    res.data.forEach(v => {
                        html += `<div class="item" data-id=${v.id}>
                            <div class="inner">
                                <div class="img enter"></div>
                                <div class="option">
                                    <i class="copy iconfont icon alt disable">&#xe6e5;</i>
                                    <i class="delete iconfont icon alt">&#xe624;</i>
                                </div>
                                <div class="name">${v.name}</div>
                            </div>
                        </div>`;
                    });
                    cp.html(DOMAIN, html);
                } else {
                    console.error(res)
                }
            }
        });
    }

    enter(target) {
        let p = cp.parent(target, "item");
        let pid = cp.getData(p);
        localStorage.setItem("pid", pid);
        cp.link('/main');
    }

    autoSize() {
        let {width} = cp.domSize(DOMAIN);
        /*
        //取模:不定长和基数取模
        let mod = width % this.defaultSize;
        //取商:不定长和基数取商
        let div = Math.floor(width / this.defaultSize);
        //取模的商
        let modDiv = mod / div;
        //基数加模的商
        let autoWidth = width + modDiv;
        */
        //自动适应的宽度
        let autoWidth = Math.floor(width % this.defaultSize / Math.floor(width / this.defaultSize) + this.defaultSize);

        //移除尺寸
        cp.removeClass(DOMAIN, /^auto-/g);
        //目标类名
        let clazz = 'auto-' + autoWidth + '' + autoWidth;
        let selectorText = '#' + NAME + '.' + clazz + ' > .item';
        //判断是否存在样式
        !cp.hasSheet(selectorText) && cp.setSheet(selectorText, {
            width: autoWidth + 'px',
            height: autoWidth + 'px'
        });
        cp.addClass(DOMAIN, clazz);
    }
}