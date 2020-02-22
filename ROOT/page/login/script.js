class App {
    DOM() {
        this.loginBoxDom = cp.query(".login-box");
        this.signinDom = cp.query(".signin", this.loginBoxDom);
        this.idDom = cp.query(".id > input", this.signinDom);
        this.pwdDom = cp.query(".pwd > input", this.signinDom);
        this.supportInfoDom = cp.query(".support-info", this.loginBoxDom);
        this.clientDownloadDom = cp.query(".client-download", this.loginBoxDom);
    }

    //初始化函数
    INIT() {
        //if (!window.global) {
        cp.show(this.supportInfoDom);
        cp.show(this.clientDownloadDom);
        //}

        let urlParam = cp.getQueryVar();
        if (urlParam["logout"]) {
            //清除token
            localStorage.clear();
        } else {
            //检查token
            let token = localStorage.getItem("Authorization");
            if (token) {
                cp.link("/project")
            }
        }
    }

    //添加事件
    EVENT() {
        //登录
        cp.on('.submit', this.signinDom, 'click', () => this.submit());
        //注册
        cp.on('.signup', this.signinDom, 'click', () => this.signup());
    }

    //提交
    signup() {
        let id = this.idDom.value,
            pwd = this.pwdDom.value;
        if (id === "" || pwd === "") {
            this.getModule("dialog").show({
                type: "warn",
                text: "请填写完整账号密码"
            });
        }
        cp.ajax(CONF.ServerAddr + "/auth/signup", {
            data: {
                email: id,
                password: pwd
            },
            success: res => {
                if (res.code === 0) {
                    this.getModule("dialog").show({
                        type: "loading",
                        text: "请稍后..."
                    });
                    //注册成功返回token
                    localStorage.setItem("Authorization", res.data);
                    cp.link("/project")
                } else {
                    this.getModule("dialog").show({
                        type: "warn",
                        text: "注册失败！"
                    });
                }
            }
        })
    }

    //登录
    submit() {
        let id = this.idDom.value,
            pwd = this.pwdDom.value;

        if (id === "" || pwd === "") {
            this.getModule("dialog").show({
                type: "warn",
                text: "请填写完整账号密码"
            });
        }
        cp.ajax(CONF.ServerAddr + "/auth/signin", {
            data: {
                email: id,
                password: pwd
            },
            success: res => {
                if (res.code === 0) {
                    this.getModule("dialog").show({
                        type: "loading",
                        text: "请稍后..."
                    });
                    localStorage.setItem("Authorization", res.data);
                    /*if (window.global) {
                        (function sendMessage() {
                            setTimeout(() => {
                                try {
                                    //告诉客户端登录成功了
                                    ipc.sendSync("loginSuccessMessageSync", res.data);
                                    //默认首页
                                    cp.link("/project")
                                } catch (e) {
                                    sendMessage();
                                }
                            }, 100)
                        })()
                    } else {
                        cp.link("/project")
                    }*/

                    cp.link("/project")
                } else {
                    this.getModule("dialog").show({
                        type: "warn",
                        text: "密码错误，多次错误将锁定用户！"
                    });
                }
            }
        })
    }
}