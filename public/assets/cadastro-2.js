function changeField(id) {
    if(id === "senha2")
        id = "senha";
    clearError(id);
}

function avancar() {
    let medico = {
        "address1": !$("#nao1").prop("checked") ? $("#address1").val() : "",
        "tel1": !$("#nao1").prop("checked") ? $("#tel1").cleanVal() : "",
        "nao1": $("#nao1").prop("checked"),
        "address2": !$("#nao2").prop("checked") ? $("#address2").val() : "",
        "tel2": !$("#nao2").prop("checked") ? $("#tel2").cleanVal() : "",
        "nao2": $("#nao2").prop("checked")
    }

    if (validateMedico(medico)) {
        localStorage.medico2 = JSON.stringify(medico);
        pageTransition(HOME + "cadastro-3", "route", "forward");
    }
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

    if(!medico.nao1 && medico.address1.length < 5)
        showError("Endereço muito curto", "address1");

    if(!medico.nao2 && medico.address2.length < 5)
        showError("Endereço muito curto", "address2");

    if(!medico.nao1 && medico.tel1.length < 10)
        showError("Telefone inválido", "tel1");

    if(!medico.nao2 && medico.tel2.length < 10)
        showError("Telefone inválido", "tel2");

    if(!medico.nao1 && (typeof medico.address1 !== "string" || medico.address1 === ""))
        showError("Preencha este campo", "address1");

    if(!medico.nao1 && (typeof medico.tel1 !== "string" || medico.tel1 === ""))
        showError("Preencha este campo", "tel1");

    if(!medico.nao2 && (typeof medico.address2 !== "string" || medico.address2 === ""))
        showError("Preencha este campo", "address2");

    if(!medico.nao2 && (typeof medico.tel2 !== "string" || medico.tel2 === ""))
        showError("Preencha este campo", "tel2");

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
    $(".cpf").mask('999.999.999-99', {reverse: !0});

    $("input").off("change keyup").on("change keyup", function () {
        changeField($(this).attr("id"));
    });

    $("#arrowback").off("click").on("click", function () {
        history.back();
    });

    $("#nao1, #nao2").off("click").on("click", function () {
        let id = $(this).attr("name");
        if($(this).prop("checked")) {
            $("#address" + id + ", #tel" + id).attr("disabled", "disabled").prop("disabled", !0).addClass("disabled");
            $("label[for='address" + id + "']").addClass("opacity");
        } else {
            $("#address" + id + ", #tel" + id).removeAttr("disabled").prop("disabled", !1).removeClass("disabled");
            $("label[for='address" + id + "']").removeClass("opacity");
        }
    });

    if(localStorage.medico2) {
        let medico = JSON.parse(localStorage.medico2);
        if(typeof medico.address1 === "string")
            $("#address1").val(medico.address1);

        if(typeof medico.tel1 === "string")
            $("#tel1").val(medico.tel1);

        if(typeof medico.address2 === "string")
            $("#address2").val(medico.address2);

        if(typeof medico.tel2 === "string")
            $("#tel2").val(medico.tel2);

        if(medico.nao1)
            $("#nao1").trigger("click");

        if(medico.nao2)
            $("#nao2").trigger("click");
    }

    $("input[type='checkbox']").off("change").on("change", function () {
        let id = $(this).attr("name");
        if($(this).prop("checked")) {
            $("#address" + id + ", #tel" + id).val("");
            clearError("address" + id);
            clearError("tel" + id);
        }
    });
});