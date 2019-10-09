var loginFree = !0;

function login() {
    if (loginFree) {

        if($("#emaillog").val() === "") {
            toast("Informe o email");
            return;
        }
        if($("#passlog").val() === "") {
            toast("Informe a senha");
            return;
        }

        $("#login-card").loading();
        loginFree = !1;
        toast("Validando dados!", 15000);
        post('site-pstmc', 'login', {email:  $("#emaillog").val(), password: $("#passlog").val()}, function (g) {
            loginFree = !0;

            if (g) {
                localStorage.removeItem("medico");
                localStorage.removeItem("medico2");
                localStorage.removeItem("medico3");

                toast("Seja Bem-vindo!", 2500, "toast-success");
                app.setLoading();
                setCookieUser(g).then(() => {
                    app.removeLoading();
                    toast("", 1);
                    pageTransition(HOME + "dashboard", "route", "forward");
                })
            } else {
                navigator.vibrate(100);
            }
        })
    }
}

function saibamais() {
    lightbox("<img src='"+ HOME +"public/assets/img/epistemic1.png' class='col'>");
}

$(function () {
    if (getCookie("token") !== "" && getCookie("token") !== "0")
        pageTransition("dashboard", "route", "fade", "#core-content", null, null, !1);
    $("#app").off("keyup", "#emaillog, #passlog").on("keyup", "#emaillog, #passlog", function (e) {
        if (e.which === 13)
            login()
    });
    setTimeout(function () {
        $("input").removeAttr("disabled");
    }, 300);

    if(localStorage.loginData) {
        setTimeout(function () {
            $("#emaillog").val(localStorage.loginData.email);
            $("#passlog").val(localStorage.loginData.senha);
            setTimeout(function () {
                localStorage.removeItem('loginData');
            },100);
        }, 400);
    }
})