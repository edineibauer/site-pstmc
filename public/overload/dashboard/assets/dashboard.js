function addPatient() {
    if ($("#add-paciente").hasClass("hide")) {
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
    if (!envioStatus) {
        envioStatus = !0;
        let medico = {
            "name": $("#nome").val(),
            "phone_number": iti.getSelectedCountryData().dialCode + $("#telefone").cleanVal()
        };

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

    /*if (medico.name.length < 3)
        showError("Nome muito curto", "nome");*/

    /*if (medico.phone_number.length < 10)
        showError("Telefone inválido", "telefone");*/

    /*if (typeof medico.name !== "string" || medico.name === "")
        showError("Preencha este campo", "nome");*/

    if (typeof medico.phone_number !== "string" || medico.phone_number === "")
        showError("Preencha este campo", "telefone");

    return !error;
}

/**
 * Obter atualizações de pacientes
 * */
function readUpdatesPacientesServer() {
    return get("read-pacientes-updates").then(p => {
        return dbLocal.clear("pacientesUpdates").then(() => {
            let a = [];
            a.push(p);
            $.each(p, function (i, e) {
                dbLocal.exeRead("pacientes", e.patientID).then(data => {
                    e.patient = data;
                    e.id = i;
                    a.push(dbLocal.exeCreate("pacientesUpdates", e));
                })
            });

            return Promise.all(a).then(d => {
                return d[0];
            });
        });
    });
}

function readUpdatesPacientes() {
    return dbLocal.exeRead("pacientesUpdates").then(data => {
        if (!isEmpty(data)) {
            readUpdatesPacientesServer();
            return data;
        } else {
            return readUpdatesPacientesServer();
        }
    });
}

var iti = null;
$(function () {
    updatePerfilPage();

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
    readPacientes().then(pacientes => {
        dbLocal.exeRead("__template", 1).then(tpl => {
            $("#lista-pacientes").html("");
            if (!isEmpty(pacientes)) {
                $.each(pacientes, function (i, e) {

                    //limita a 8 pacientes
                    if (i > 7)
                        return false;

                    $("#lista-pacientes").append(Mustache.render(tpl.paciente, e));
                });
            } else {
                $("#lista-pacientes").append(Mustache.render(tpl.pacienteEmpty, {}));
            }
        });
    }).then(() => {

        /**
         * Leitura das atualizações
         */
        readUpdatesPacientes().then(atualizacoes => {
            return dbLocal.exeRead("__template", 1).then(tpl => {
                $("#timeline").html("");
                if (!isEmpty(atualizacoes)) {
                    atualizacoes.reverse();
                    $.each(atualizacoes, function (i, e) {
                        e.date = moment(e.date).format("lll");
                        $("#timeline").append(Mustache.render(tpl.pacientesUpdates, e));
                    });
                } else {
                    let d = new Date();
                    // let img = d.getHours() > 6 && d.getHours() < 19 ? "dia" : "noite";
                    $("#timeline").append(Mustache.render(tpl.pacientesUpdatesEmpty, {HOME: HOME, VENDOR:VENDOR, img: "nothing"}));
                }
            });
        })
    });

    let input = document.querySelector("#telefone");
    iti = intlTelInput(input, {
        dropdownContainer: document.body,
        initialCountry: "br",
        utilsScript: HOME + VENDOR + "site-pstmc/public/assets/utils.js"
    });
    clearToast();

    getTemplates().then(tpl => {
        $("#dashboard").append(Mustache.render(tpl.ajustes, {home: HOME}));
    });
});