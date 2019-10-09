var recoveryFree = !0;

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase())
}

function recoveryEmail() {
    if (recoveryFree) {
        recoveryFree = !1;
        let email = $("#recovery-email").val();
        if (validateEmail(email)) {
            post('site-pstmc', 'recoveryEmail', {email: email}, function (g) {
                recoveryFree = !0;
                if (g) {
                    toast('Email de recuperação enviado!', 4000, "toast-success");
                    $("#recovery-email").val("")
                }
            })
        } else {
            toast("Email inválido");
            recoveryFree = !0
        }
    }
}

$(function () {
    $("#app").off("keyup", "#recovery-email").on("keyup", "#recovery-email", function (e) {
        if (e.which === 13)
            recoveryEmail()
    });

    setTimeout(function () {
        $("input").removeAttr("disabled");
    }, 300);

    $(".arrowback").off("click").on("click", function () {
        history.back();
    });
})