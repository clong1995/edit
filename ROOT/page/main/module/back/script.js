class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        cp.on('.back', DOMAIN, 'click', t => this.back());
        cp.on('.save', DOMAIN, 'click', t => this.save());
    }

    INIT() {
        //this.initList();
    }

    back() {
        localStorage.removeItem("pid");
        cp.link('/project')
    }

    /**
     * 更新和保存
     */
    save(cb) {
        let name = this.APP.scene.page.name;
        let data = JSON.stringify(this.APP.scene);

        //比较数据是否修改

        cp.ajax(CONF.ServerAddr + "/scene/add", {
            data: {
                sceneId: this.APP.getSceneId() || "",
                projectId: localStorage.getItem("pid"),
                name: name,
                data: data
            },
            success: res => {
                if (res.code === 0) {
                    this.APP.setSceneId(res.data);
                    this.APP.prevDataMD5 = md5(data);
                    typeof cb === "function" && cb()
                } else {
                    console.error(res)
                }
            }
        })
    }
}