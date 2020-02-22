class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
        this.rmsDom = cp.query('.rms', this.listDom);
    }

    EVENT() {
        cp.on('.item', DOMAIN, 'click', t => this.clickItem(t));
    }

    INIT() {
        //TODO 检查权限
        cp.ajax(CONF.ServerAddr + "/user/info", {
            success: res => {
                if (res.code === 0) {
                    let rank = res.data["rank"];
                    if (rank < 3) {
                        cp.show(this.rmsDom)
                    }
                }
            }
        })
    }

    clickItem(target) {
        if (cp.hasActive(target)) {
            return;
        }
        cp.link("/" + cp.getData(target))
    }

    selectItem(name) {
        cp.addActive(cp.query("." + name, this.listDom))
    }
}