class Module {
    DOM() {
        this.listDom = cp.query('.list', DOMAIN);
    }

    EVENT() {
        cp.on('.layer', this.listDom, 'click', t => this.toggleActive(t));
        cp.on('.layer', this.listDom, 'change', (t1, t2) => this.changeLayer(t1, t2));
    }

    INIT() {

    }

    reloadList(id) {
        let layerHtml = "";
        let list = this.APP.getComponentDataList();
        for (let i = list.length - 1; i >= 0; i--) {
            let v = list[i];
            layerHtml += `<div class="layer ${v.id === id ? "active" : ""}" id="layer_${v.id}">
                            <div class="num">${v.index - 10}</div>
                            <div class="thumbnail"></div>
                            <input class="name" value="${v.nickname || v.title}"/>
                        </div>`;
        }
        cp.html(this.listDom, layerHtml)
    }

    changeLayer(target1, target2) {
        let id = target1.id.split("_")[1];
        let componentData = this.APP.getComponentData(id);
        if (cp.hasClass(target2, "name")) {
            let value = target2.value;
            componentData["nickname"] = value;
            if (!value) {
                target2.value = componentData.title
            }
        }
    }

    addLayer(data) {
        //增加图层
        let layerHtml = `<div class="layer" id="layer_${data.id}">
                            <div class="num">${data.index - 10}</div>
                            <div class="thumbnail"></div>
                            <input class="name" value="${data.nickname || data.title}"/>
                        </div>`;
        cp.html(this.listDom, layerHtml, "afterbegin")
    }


    toggleActiveById(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.toggleActive(layerDom)
    }

    getLayerDom() {
        return cp.query("#layer_" + id, this.listDom);
    }

    toggleActive(target) {
        let id = target.id.split("_")[1];
        cp.toggleActive(target);
        MODULE("canvas").toggleActiveById(id);
        MODULE("edit").activeComponentEditById(id);
    }

    removeActiveById(id) {
        let sliceDom = cp.query("#layer_" + id, this.sceneDom);
        cp.removeActive(sliceDom)
    }

    setName(id) {
        let componentData = this.APP.getComponentData(id);
        let layerDom = cp.query("#layer_" + id, this.listDom);

        cp.html(cp.query(".name", layerDom), componentData.title)
    }

    delete(id) {
        let layerDom = cp.query("#layer_" + id, this.listDom);
        cp.remove(layerDom);
    }

    empty() {
        cp.empty(this.listDom)
    }
}