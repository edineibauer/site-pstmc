function addPatient() {
    if($("#add-paciente").hasClass("hide")) {
        openPaciente();
    } else {
        closePaciente();
    }
}

function openPaciente() {
    $("#add-paciente").removeClass("hide");
    animateFadeEffect("#add-paciente");
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
                    animateFadeEffect("#convite-paciente");
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
    return dbLocal.exeRead("pacientes").then(pacientes => {
        return pacientes.filter((e) => {return e.first_name.search(val.trim()) > -1 || e.first_name.toLowerCase().search(val.trim()) > -1;});
    }).then(pacientes => {
        dbLocal.exeRead("__template", 1).then(tpl => {
            $("#lista-pacientes").html("");
            if (!isEmpty(pacientes)) {
                $.each(pacientes, function (i, e) {
                    $("#lista-pacientes").append(Mustache.render(tpl.paciente, e));
                });
            } else {
                $("#lista-pacientes").append(Mustache.render(tpl.pacienteEmpty, {}));
            }
        });
    });
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

var searchTime = null;
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
        let v = $(this).val();
        clearTimeout(searchTime);
        searchTime = setTimeout(function () {
            search(v);
        }, 500);
    });

    $("#btn-search").off("click").on("click", function () {
        clearTimeout(searchTime);
        search($("#search-paciente").val());
    });


    /**
     * Obter lista de pacientes
     * */
    readPacientes().then(pacientes => {
        dbLocal.exeRead("__template", 1).then(tpl => {
            $("#lista-pacientes").html("");
            if (!isEmpty(pacientes)) {
                $.each(pacientes, function (i, e) {
                    $("#lista-pacientes").append(Mustache.render(tpl.paciente, e));
                });
            } else {
                $("#lista-pacientes").append(Mustache.render(tpl.pacienteEmpty, {}));
            }
        });
    });
});