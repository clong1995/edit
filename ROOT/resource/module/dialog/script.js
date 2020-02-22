class Module {
    DOM() {
        this.titleDom = cp.query('.title', DOMAIN);
        this.confirmDom = cp.query('.confirm', DOMAIN);
        this.cancelDom = cp.query('.cancel', DOMAIN);
        this.textDom = cp.query('.text', DOMAIN);
        this.iconDom = cp.query('.icon', DOMAIN);
    }

    EVENT() {
        //coo.on('.confirm', this.optionDom, 'click', t => this.cofirmFn && this.cofirmFn(t));
    }

    INIT() {
        this._sheetStyle();
    }

    //内置样式
    _sheetStyle() {
        cp.setSheet('#' + NAME, {
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,.5)',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 999
        });
        cp.addClass(DOMAIN, ['centerWrap', 'hide'])
    }

    /**
     *
     * @param type
     * @param text
     * @param confirm
     * @param cancel
     */
    show({
             type = 'info',
             text = '提示信息',
             confirm = null,
             cancel = null
         } = {}) {
        //提示信息
        let icon = '&#xe665;';
        let title = '提示';
        //警告信息
        if (type === 'warn') {
            icon = '&#xe63f;';
            title = '警告';
        }
        //错误信息
        else if (type === 'error') {
            icon = '&#xe639;';
            title = '错误';
        }
        //等待信息
        else if (type === 'loading') {
            icon = '&#xe6ab;';
            title = '等待';
        }
        cp.text(this.titleDom, title);
        cp.html(this.iconDom, icon);
        cp.text(this.textDom, text);

        //一直存在确认按钮
        this.confirmDom.onclick = () => confirm && typeof confirm === 'function'
            ? confirm(this.hide.bind(this))
            : this.hide();


        //取消，只有在警告级别才会有
        if (type === 'warn' && cancel && typeof cancel === 'function') {
            cp.show(this.cancelDom);
            this.cancelDom.onclick = () => cancel(this.hide.bind(this));
        }

        //显示窗口
        cp.show(DOMAIN);
    }

    text(text) {
        cp.text(this.textDom, text);
    }

    hide() {
        cp.hide(DOMAIN);
        this.dispose();
        return this
    }

    dispose() {
        this.confirmDom.onclick = null;
        this.cancelDom.onclick = null
    }
}