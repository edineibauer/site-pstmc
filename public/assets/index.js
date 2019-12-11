function saibamais() {
    $("#parent").animate({
        scrollTop: $("#saibamais-content").offset().top
    }, 700);
}

function goToLogin() {

    $("#parent").animate({
        scrollTop: $("#background-login").offset().top
    }, 1100);

    $("#login-acessar").remove();
    $("#login-sitename").removeClass("titleLogin");
    $("#div-saibamais").removeClass("saibamais");
    $("#background-login").css("filter", "blur(27px)");
    $("#login-title").addClass("l6");
    $("#login-card").find(".hide").removeClass("hide");
    animateFadeEffect("#login-card");
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

    $("#login-card, #login-title").css("min-height", window.innerHeight + "px");
    /*$("#saibamais-content").css("margin-bottom", window.innerHeight + "px");
*/

    $("#parent").scroll(function () {
        let block1 = $("#block1").offset().top;
        let block2 = $("#block2").offset().top;
        let block3 = $("#block3").offset().top;
        let block4 = $("#block4").offset().top;
        let block5 = $("#block5").offset().top;
        var scroll = $(this).scrollTop();
        let animationCount = {
            first: !1,
            second: !1,
            third: !1,
            forth: !1,
            fifth: !1,
        };

        if (!animationCount.first && scroll > block1 + (window.innerHeight / 2.8)) {
            animationCount.first = !0;
            $(".title-block1:eq(1)").css("opacity", 1).addClass("animate-left animate-fading");
            setTimeout(function () {
                $(".title-block1:eq(0)").css("opacity", 1).addClass("animate-left animate-fading");
            },200);
        }

        if (!animationCount.second && scroll > block2 + (window.innerHeight / 2)) {
            animationCount.second = !0;
            $(".title-block2:eq(1)").css("opacity", 1).addClass("animate-right animate-fading");
            setTimeout(function () {
                $(".title-block2:eq(0)").css("opacity", 1).addClass("animate-right animate-fading");
            },200);

            $("#block2").find("img").addClass("active");
        }

        if (!animationCount.forth && scroll > block4 + window.innerHeight * 1.3 ) {
            animationCount.forth = !0;
            $(".title-block4:eq(1)").css("opacity", 1).addClass("animate-left animate-fading");
            setTimeout(function () {
                $(".title-block4:eq(0)").css("opacity", 1).addClass("animate-left animate-fading");
            },200);
        }

        if (!animationCount.fifth && scroll > block5 + window.innerHeight * 1.8) {
            animationCount.fifth = !0;
            $(".title-block5:eq(1)").css("opacity", 1).addClass("animate-right animate-fading");
            setTimeout(function () {
                $(".title-block5:eq(0)").css("opacity", 1).addClass("animate-right animate-fading");
            },200);
        }

        if (!animationCount.third && scroll > block3 + window.innerHeight * 2.5) {
            animationCount.third = !0;
            $(".title-block3:eq(1)").css("opacity", 1).addClass("animate-left animate-fading");
            setTimeout(function () {
                $(".title-block3:eq(0)").css("opacity", 1).addClass("animate-left animate-fading");
            },200);
        }
    });
});