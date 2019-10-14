//variável para máscara de telefone
var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009'
}, spOptions = {
    onKeyPress: function (val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options)
    }
};

function lightbox(content) {
    $(".core-overlay").css({"opacity": 1, "transform": "translateX(0)"});
    $("#core-overlay-content").html(content);
    $("#core-overlay-div").css({"opacity": 1, "transform": "translateX(0)"});
}

function logout() {
    if(confirm("Sair do Sistema"))
        logoutDashboard();
}

function updatePerfilPage() {
    $(".perfil-photo_64").attr("src", (!localStorage.photo_64 || localStorage.photo_64 === "null" || localStorage.photo_64 === "" ? HOME + "uploads/site/image-not-found.png" : localStorage.photo_64));
    $(".perfil-name").html(localStorage.name && localStorage.name !== "null" ? localStorage.name : "");
    $(".perfil-crm").html(localStorage.crm && localStorage.crm !== "null" ? localStorage.crm : "");
    $(".perfil-cpf").html(localStorage.cpf && localStorage.cpf !== "null" ? localStorage.cpf : "");
    $(".perfil-birthday").html(localStorage.birthday.replace("-", "/").replace("-", "/"));
    $(".perfil-email").html(localStorage.email && localStorage.email !== "null" ? localStorage.email : "");
    $(".perfil-phone_number").html(localStorage.phone_number && localStorage.phone_number !== "null" ? localStorage.phone_number : "");

    if(localStorage.address1 && localStorage.address1 !== "null" && localStorage.address1 !== " - ") {
        $("#block-address1").removeClass("hide");
        let a = localStorage.address1.split(" - ");
        let tel = a[a.length - 1].trim();
        $(".perfil-tel1").html(tel);
        $(".perfil-address1").html(localStorage.address1.replace(" - " + tel, ""));
    } else {
        $("#block-address1").addClass("hide");
    }
    if(localStorage.address2 && localStorage.address2 !== "null" && localStorage.address2 !== " - ") {
        $("#block-address2").removeClass("hide");
        a = localStorage.address2.split(" - ");
        tel = a[a.length - 1].trim();
        $(".perfil-tel2").html(tel);
        $(".perfil-address2").html(localStorage.address2.replace(" - " + tel, ""));
    } else {
        $("#block-address2").addClass("hide");
    }

    $(".perfil-phone_number, .perfil-tel1, .perfil-tel2").mask(SPMaskBehavior, spOptions);
    $(".perfil-cpf").mask('999.999.999-99', {reverse: !0});

    setTimeout(function () {
        $(".perfil-phone_number, .perfil-tel1, .perfil-tel2, .perfil-cpf").trigger("input");
    }, 100);
}

function idade(stringdate) {
    let a = stringdate.split("-");
    let ano_aniversario = parseInt(a[0]);
    let mes_aniversario = parseInt(a[1]);
    let dia_aniversario = parseInt(a[2]);
    var d = new Date,
        ano_atual = d.getFullYear(),
        mes_atual = d.getMonth() + 1,
        dia_atual = d.getDate(),
        quantos_anos = ano_atual - ano_aniversario;

    if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario)
        quantos_anos--;

    return quantos_anos < 0 ? 0 : quantos_anos;
}

/**
 * Ler paciente específico
 * @param id
 * @param retry
 */
function readPaciente(id, retry) {
    return dbLocal.exeRead("pacientes", id).then(d => {
        if(!isEmpty(d)) {
            return d;
        } else if(typeof retry === "undefined") {
            return getPacientes().then(() => {
                return readPaciente(1);
            })
        } else {
            toast("Id do paciente não encontrado!", 5000, "toast-warning");
            return pageTransition(HOME + "pacientes", "route", "forward");
        }
    });
}

/**
 * obter pacientes do servidor
 * @returns {PromiseLike<any[]> | Promise<any[]> | *}
 */
function getPacientesServer() {
    return get("read-pacientes").then(p => {
        let aa = [];
        let pp = [];
        aa.push(p);
        if(!isEmpty(p)) {
            $.each(p, function (i, e) {
                e.patient.idade = idade(e.patient.birthday);
                let image = (e.patient.gender === "F" ? "woman" : "man") + Math.floor((Math.random() * 9) + 1);
                e.patient.imagem = (typeof e.patient.photo_64 !== "undefined" && e.patient.photo_64 !== "null" && !isEmpty(e.patient.photo_64) ? e.patient.photo_64 : HOME + VENDOR + DOMINIO + "/public/assets/img/people/" + image + ".png");
                pp.push(e.patient);
                aa.push(dbLocal.exeCreate('pacientes', e.patient));
            });
        }
        aa.push(pp);

        return Promise.all(aa).then(d => { return d[d.length - 1]; });
    });
}

/**
 * Obter lista de pacientes Local then server
 * @returns {PromiseLike<any> | Promise<any> | *}
 */
function readPacientes() {
    return dbLocal.exeRead("pacientes").then(pacientes => {
        if(!isEmpty(pacientes)) {
            getPacientesServer();
            return pacientes;
        } else {
            return getPacientesServer();
        }
    });
}

function clearFadeIn(content) {
    $(content).find(".easefadein")
        .addClass("notransition")
        .css("opacity", 0)
        .css("transform", "translateY(-20px)")
        .removeClass("notransition");
}

function animateFadeEffect(content) {
    clearFadeIn(content);
    $(content).find(".easefadein").each(function(i, e) {
        if($(this).hasAttr("data-fade-delay")) {
            let delay = parseInt($(this).attr("data-fade-delay"));
            setTimeout(function () {
                $(e).css("opacity", 1).css("transform", "translateY(0)");
            }, delay);
        } else {
            setTimeout(function () {
                $(e).css("opacity", 1).css("transform", "translateY(0)");
            }, 15);
        }
    });
}

function animateFadeReverse(content) {
    let d = 0;
    let $fade = $(content).find(".easefadein");
    $fade.each(function(i, e) {
        if($(this).hasAttr("data-fade-delay")) {
            let delay = parseInt($(this).attr("data-fade-delay"));
            d = (delay > d ? delay : d);
            setTimeout(function () {
                $(e).css("opacity", 0).css("transform", "translateY(-20px)");
            }, delay);
        }
    });

    setTimeout(function () {
        $fade.each(function(i, e) {
            if (!$(e).hasAttr("data-fade-delay"))
                $(e).css("opacity", 0).css("transform", "translateY(-20px)");
        });
    }, d);

    return d;
}

$(function () {
    updatePerfilPage();

    $("#core-overlay-div, #core-overlay-close > i").off("click").on("click", function(e) {
        if (e.target !== this)
            return;

        $(".core-overlay").css({"opacity": 0, "transform": "translateX(-100%)"});
        $("#core-overlay-div").css({"opacity": 0, "transform": "translateX(-100%)"});
        $("#core-overlay-content").html("");
    });
});