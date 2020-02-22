const IP = "127.0.0.1";
const CONF = {
    //页面地址
    WebAddr: "http://" + IP + ":50002",
    //服务地址
    ServerAddr: "http://" + IP + ":50001",
    //本地址，不需要改！
    QiniuAddr: "http://storage.quickex.com.cn",
    QiniuThumbnail: "imageMogr2/thumbnail/100x100>/blur/1x0/quality/75"
};

//ajax的额外处理器
//消息头处理
const ajaxHeadersInterceptor = url => {
    let arr = url.split("/");
    let l = arr.pop(),
        p = arr.pop();
    let uri = p + "/" + l;
    if (uri === "auth/signin" || uri === "auth/signup") {
        return {
            "Content-type": "application/x-www-form-urlencoded"
        }
    }

    //验证token
    let token = localStorage.getItem("Authorization");
    if (!token) {
        cp.link("/login");
        return;
    }
    return {
        "Content-type": "application/x-www-form-urlencoded",
        "Authorization": token
    }
};

//消息体处理
const ajaxResponseInterceptor = res => {
    if (res.code !== 0) {
        console.error(res);
        if (res.code === 2) { //认证错误
            localStorage.removeItem("Authorization");
            cp.link("/login");
            //终止程序
            return false;
        }
    }
    return res;
};