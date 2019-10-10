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
        toast("Validando dados!", 35000);
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
    $('html, body').animate({
        scrollTop: $("#saibamais-content").offset().top
    }, 700);
}

function goToLogin() {
    $("#login-acessar").remove();
    $("#login-sitename").removeClass("titleLogin");
    $("#div-saibamais").removeClass("saibamais");
    $("#background-login").css("filter", "blur(27px)");
    $("#login-title").addClass("m6");
    $("#login-card").find(".hide").removeClass("hide");
    animateFade("#login-card");
    $("#emaillog").focus();
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

    $("#login-card, #login-title").css("min-height", window.innerHeight + "px");
    $("#saibamais-content").css("margin-bottom", window.innerHeight + "px");

    $(window).scroll(function (event) {
        var scroll = $(window).scrollTop();
        if(scroll > 2500) {
            $("#login-container").css({"position": "fixed", "bottom": 0, "left": 0});
            $("#saibamais-content").css("margin-top", window.innerHeight + "px");

            let heightTop = $("#login-card")[0].clientHeight / 2;
            $(".imgsaibamais").each(function (i, e) {
                heightTop += $(e)[0].clientHeight;
            });
            if(scroll > heightTop && $("#login-sitename").hasClass("titleLogin"))
                goToLogin();
        } else {
            $("#login-container").css({"position": "relative"});
            $("#saibamais-content").css("margin-top", 0);
        }
    });
});