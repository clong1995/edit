class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    EVENT() {
        // coo.on('.addBtn', this.domain, 'click', t => this.showStory());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    INIT() {
        this._sheetStyle();
    }

    //内置样式
    _sheetStyle() {
        cp.setSheet('#' + NAME, {
            width: "100%",
            height: "20px",
            lineHeight: "20px",
            padding: "0 15px",
            fontSize: "11px",
            borderTop: "var(--border)",
            float: "left"
        });
    }
}