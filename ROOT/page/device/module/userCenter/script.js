class Module {
    DOM() {
        // this.addContentDom = coo.query('.addContent', DOMAIN);
    }

    EVENT() {
        cp.on('.logout', DOMAIN, 'click', () => cp.link("/login?logout=true"));
    }

    INIT() {

    }
}