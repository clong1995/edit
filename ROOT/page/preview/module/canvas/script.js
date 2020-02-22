class Module {
    DOM() {
        this.containerDom = cp.query('.container', DOMAIN);
    }

    INIT() {
        this.componentCache = new Map();
        cp["componentClassCache"] = new Map();
        cp["componentEntity"] = new Map();

        let sid = cp.getQueryVar();

        //获取数据，加载场景
        cp.ajax(CONF.ServerAddr + "/scene/getById", {
            data: {
                id: sid.id
            },
            success: res => {
                if (res.code === 0) {
                    this.sceneDom = null;
                    this.sceneMargin = 10;
                    //加载场景，赋值给了主页面
                    this.scene = JSON.parse(res.data.data);
                    //加载场景
                    this.loadScene();
                } else {
                    console.error(res)
                }
            }
        })
    }

    EVENT() {

    }

    loadScene() {
        //加载场景
        this.sceneDom = cp.createDom();
        cp.addClass(this.sceneDom, 'scene');
        let pageData = this.scene.page;

        cp.css(this.sceneDom, {
            width: pageData.size.width + 'px',
            height: pageData.size.height + 'px',
        });
        this.sceneSize();
        cp.append(this.containerDom, this.sceneDom);

        //重新计算大小
        window.onresize = () => this.sceneSize();

        //加载组件
        this.loadComponent(this.scene.components);
    }

    sceneSize() {
        //获取容器大小
        let {width, height} = cp.domSize(this.containerDom);
        let pageData = this.scene.page;
        let size = cp.autoSize({
            w: width, h: height
        }, {
            w: parseInt(pageData.size.width) + 2, h: parseInt(pageData.size.height) + 2
        }, this.sceneMargin);

        //返回大小
        cp.css(this.sceneDom, {
            zoom: size.scale,
            top: size.t / size.scale + 'px',
            left: size.l / size.scale + 'px',
            //适应背景大小
            backgroundSize: (20 / size.scale) + 'px ' + (20 / size.scale) + 'px'
        });
    }

    loadComponent(loadedComponentsData) {
        loadedComponentsData.forEach(v => {
            //TODO 这里产生了循环内的请求
            this.getComponent(v.name.replace("-", "/"), v);
        })
    }

    getComponent(name, data) {
        //查询是否包含了组件
        if (this.componentCache.has(name)) {
            this.makeComponent(name, this.componentCache.get(name), data);
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.onload = () => this.makeComponent(name, xhr.responseText, data);
        xhr.open("GET", "/component/" + name, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(null);
    }

    makeComponent(name, compStr, data) {
        let dataArr = compStr.split("--- IxD component ---");

        //加载组件dom
        this.addSlice(data, dataArr[1]);

        //缓存策略
        if (!this.componentCache.has(name)) {
            //首次加载
            //css
            this.componentStyleCompiler(dataArr[3], data.name);
            //js
            this.componentScriptCompiler(dataArr[2], data.name);
            //缓存
            this.componentCache.set(name, compStr)
        }
        //忽略css
        //忽略类js
        //创建实体
        let entity = null;
        let entityId = data.id;
        try {
            entity = new (cp.componentClassCache.get(data.name))(document.querySelector("#slice_" + entityId));
        } catch (e) {
            cp.log("创建组件 " + data.name + " 时出错，错误组件的实体 " + entityId, "error");
            console.error(e);
            return;
        }

        //
        cp.componentEntity.set(entityId, entity);

        //执行
        let optionData = data.option;
        optionData.some(v => {
            if (typeof v.value === "object") {
                for (let vv in v.value) {
                    if (!this.setComponentEntity(entity, v.key + "/" + vv, v.value[vv], data.name, entityId))
                        return true
                }
            } else {
                return !this.setComponentEntity(entity, v.key, v.value, data.name, entityId)
            }
        });
        //数据


        //数据
        if (data.realData && data.realData.api) { //存在动态数据
            //动态数据
            this.setComponentEntity(entity, "realData", data.realData, data.name, entityId);
        }else{
            let dataData = data.data;
            this.setComponentEntity(entity, "data", dataData, data.name, entityId)
        }

    }

    setComponentEntity(entity, key, value, name, id) {
        try {
            entity.OPTION(key, value);
        } catch (e) {
            cp.log("组件 " + name + " 内部出错，错误组件的实体 " + id, "error");
            console.error(e);
            return false
        }
        return true
    }

    addSlice(data, html) {
        //增加一片
        let sliceDom = cp.createDom("div", {
            id: "slice_" + data.id,
            class: "slice slice-" + data.name
        });
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
    }

    componentStyleCompiler(styleStr, name) {
        let scope = ".slice-" + name;
        let newStr = "";
        styleStr.split("}").forEach(v => {
            if (v) {
                let brr = v.split("{");
                let name = "";
                let crr = brr[0].split(",");
                crr.forEach(cv => name += scope + " > " + cv + ",");
                name = cp.trim(name, {char: ",", position: "right"});
                newStr += name + "{" + brr[1] + "}"
            }
        });
        cp.setStrSheet(newStr)
    }

    componentScriptCompiler(scriptStr, name) {
        //兼容golang安全核心
        scriptStr = scriptStr.replace("class", "clazz");
        scriptStr = scriptStr.replace(/DOMAI/g, "DOMAI_");
        //简写
        scriptStr = scriptStr.replace(/DOMAI_N/g, "this.COMP");
        //获得构造控制权
        scriptStr = scriptStr.replace(/clazz (\S*) {/, `
             clazz Module {
                 constructor(COMP) {
                     this.COMP = COMP;
                     this.DOM();
                     this.INIT();
                     this.EVENT();
                 }
         `);
        //兼容golang安全核心
        scriptStr = scriptStr.replace("clazz", "class");

        //加载js
        cp.loadScriptStr(name, `;(() =>cp.componentClassCache.set("${name}",${scriptStr}))();`);

    }
}