class Module {
    DOM() {
        this.selectShareDom = cp.query(".select-share", DOMAIN);
        this.selectPackageDom = cp.query(".select-package", DOMAIN);
    }

    EVENT() {
        //预览
        cp.on('.preview', DOMAIN, 'click', t => this.preview());
        //分享
        cp.on('.share', DOMAIN, 'click', t => this.share());
        //打包
        cp.on('.package', DOMAIN, 'click', t => this.package());
        //保存图片
        cp.on('.btn', this.selectShareDom, 'click', t => this.saveImage());
    }

    INIT() {
        setTimeout(() => {

        }, 1000)
    }

    package() {
        MODULE("window").show(this.selectPackageDom);
    }

    saveImage() {
        MODULE("edit").getCover();
    }

    share() {
        MODULE("window").show(this.selectShareDom);
    }

    preview() {
        let id = this.APP.getSceneId();

        //浏览器内
        if (!this.APP.ipc) {
            window.open("/preview?id=" + id);
            return
        }

        //electron发送到后端
        this.APP.ipc.send('message', JSON.stringify({
            "key": "preview",
            "value": id
        }));
    }
}