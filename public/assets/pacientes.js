function clearFadeIn(content) {
    $(content).find(".easefadein")
        .addClass("notransition")
        .css("opacity", 0)
        .css("transform", "translateY(-20px)")
        .removeClass("notransition");
}

function animateFade(content) {
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

function addPatient() {
    if($("#add-paciente").hasClass("hide")) {
        openPaciente();
    } else {
        closePaciente();
    }
}

function openPaciente() {
    $("#add-paciente").removeClass("hide");
    animateFade("#add-paciente");
}

function closePaciente() {
    let time = animateFadeReverse("#add-paciente");

    setTimeout(function () {
        $("#add-paciente").addClass("hide");
    }, time + 500);

    $("#nome").val("");
    $("#telefone").val("");
}

function closeConvite() {
    $("#convite-paciente").addClass("hide");
}

var envioStatus = !1;
function enviarconvite() {
    if(!envioStatus) {
        envioStatus = !0;
        let medico = {
            "name": $("#nome").val(),
            "phone_number": $("#telefone").cleanVal(),
        }

        if (validateMedico(medico)) {
            let pp = "...";
            $("#sendconvite").html("enviando&nbsp;&nbsp;&nbsp;");
            let t = setInterval(function () {
                pp = (pp === "..." ? ".&nbsp;&nbsp;" : (pp === "..&nbsp;" ? "..." : "..&nbsp;"));
                $("#sendconvite").html("enviando" + pp);
            }, 500);

            toast("Enviando", 2000);
            post("site-pstmc", "addpaciente", medico, function (g) {
                $("#sendconvite").html("Enviar Convite");
                clearInterval(t);
                envioStatus = !1;
                if (g) {
                    $("#nome").val("");
                    $("#telefone").val("");
                    toast("Paciente adicionado!", 3000, "toast-success");
                    $("#convite-paciente").removeClass("hide");
                    $("#convite-nome").html(medico.name);
                    $("#add-paciente").addClass("hide");
                    animateFade("#convite-paciente");
                }
            })
        } else {
            envioStatus = !1;
            toast("Corrija o formulário", 2500, "toast-error");
        }
    }
}

$(".arrowback").off("click").on("click", function () {
    closePaciente();
    closeConvite();
});

function search(val) {
    console.log(val);
}

function showError(mensagem, id) {
    $(".input-message[rel='" + id + "']").html(mensagem);
    $("#" + id).css("border-color", "red");
    error = !0;
    navigator.vibrate(100);
}

function clearError(id) {
    $(".input-message[rel='" + id + "']").html("");
    $("#" + id).css("border-color", "#999");
}

var error = !1;
function validateMedico(medico) {
    error = !1;

    if(medico.name.length < 3)
        showError("Nome muito curto", "nome");

    if(medico.phone_number.length < 10)
        showError("Telefone inválido", "telefone");

    if(typeof medico.name !== "string" || medico.name === "")
        showError("Preencha este campo", "nome");

    if(typeof medico.phone_number !== "string" || medico.phone_number === "")
        showError("Preencha este campo", "telefone");

    return !error;
}

$(function () {
    let SPMaskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009'
    }, spOptions = {
        onKeyPress: function (val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options)
        }
    };
    $("input[type='tel']").mask(SPMaskBehavior, spOptions);

    $("input").off("change keyup").on("change keyup", function () {
        clearError($(this).attr("id"));
    });

    $("#search-paciente").off("keyup").on("keyup", function () {
        search($(this).val());
    });

    $("#btn-search").off("click").on("click", function () {
        search($("#search-paciente").val());
    });

    /**
     * Obter lista de pacientes
     * */
    get("read-pacientes").then(p => {
       dbLocal.exeRead("__template", 1).then(tpl => {
           $("#lista-pacientes").html("");
           if(!isEmpty(p)) {
               $.each(p, function (i, e) {
                   e.patient.idade = idade(e.patient.birthday);
                   $("#lista-pacientes").append(Mustache.render(tpl.paciente, e.patient));
               });
           } else {
               $("#lista-pacientes").append(Mustache.render(tpl.pacienteEmpty, {}));
           }
       });
    });
});