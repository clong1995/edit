class Module {
    DOM() {
        this.addContentDom = cp.query('.addContent', this.domain);
    }

    EVENT() {
        cp.on('.back', DOMAIN, 'click', t => this.back());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {
        //this.initList();
    }


    back() {
        cp.link('/project')
    }

    showStory() {
        cp.show(this.addContentDom);
    }
}