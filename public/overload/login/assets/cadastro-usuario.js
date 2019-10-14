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
    $(".date").mask('99/99/9999');

    setTimeout(function () {
        $("input[type='email'], input[type='password']").removeAttr("disabled");
    },500);

    $("input").off("change keyup").on("change keyup", function () {
        changeField($(this).attr("id"));
    });

    $("#arrowback").off("click").on("click", function () {
        history.back();
    });

    if(localStorage.medico) {
        let medico = JSON.parse(localStorage.medico);
        if(typeof medico.name === "string")
            $("#nome").val(medico.name);

        if(typeof medico.birth_day === "string")
            $("#nascimento").val(medico.birth_day.replace('-', '/').replace('-', '/'));

        if(typeof medico.email === "string")
            $("#email").val(medico.email);

        if(typeof medico.cpf === "string")
            $("#cpf").val(medico.cpf);

        if(typeof medico.password === "string")
            $("#senha, #senha2").val(medico.password);

        if(typeof medico.phone_number === "string")
            $("#telefone").val(medico.phone_number);

        if(typeof medico.crm === "string")
            $("#crm").val(medico.crm);

        setTimeout(function () {
            $("input[type='tel'], .cpf").trigger("change");
            $("input[type='tel'], .cpf").trigger("input");
        }, 100);
    }
});

function changeField(id) {
    if(id === "senha2")
        id = "senha";
    clearError(id);
}

function avancar() {
    let medico = {
        "name": $("#nome").val(),
        "email": $("#email").val(),
        "cpf": $("#cpf").cleanVal(),
        "password": $("#senha").val(),
        "birth_day": $("#nascimento").val(),
        "phone_number": $("#telefone").cleanVal(),
        "crm": $("#crm").val(),
    }

    if (validateMedico(medico)) {
        medico.birth_day = medico.birth_day.replace('/', '-').replace('/', '-');
        toast("validando informações...", 10000);
        post("site-pstmc", "medico-create", {medico: {email: medico.email}}, function (g) {
            if(g) {
                showError(g, "email");
                toast(g, 2500, "toast-error");
            } else {
                toast("",1);
                localStorage.medico = JSON.stringify(medico);
                pageTransition(HOME + "cadastro-2", "route", "forward");
            }
        });
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

    if(medico.name.length < 3)
        showError("Nome muito curto", "nome");

    if(medico.crm.length < 3)
        showError("CRM muito curto", "crm");

    if(medico.phone_number.length < 10)
        showError("Telefone inválido", "telefone");

    if(!isEmail(medico.email))
        showError("Email inválido", "email");

    if(!isCPF(medico.cpf))
        showError("CPF inválido", "cpf");

    if(medico.password !== $("#senha2").val())
        showError("Senha não confere", "senha");

    if(typeof medico.name !== "string" || medico.name === "")
        showError("Preencha este campo", "nome");

    if(typeof medico.email !== "string" || medico.email === "")
        showError("Preencha este campo", "email");

    if(typeof medico.cpf !== "string" || medico.cpf === "")
        showError("Preencha este campo", "cpf");

    if(typeof medico.crm !== "string" || medico.crm === "")
        showError("Preencha este campo", "crm");

    if(typeof medico.password !== "string" || medico.password === "")
        showError("Preencha este campo", "senha");

    if(typeof medico.phone_number !== "string" || medico.phone_number === "")
        showError("Preencha este campo", "telefone");

    if(typeof medico.birth_day !== "string" || medico.birth_day === "")
        showError("Preencha este campo", "nascimento");

    let reg = new RegExp("^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$", "i");
    if(!reg.test(medico.birth_day))
        showError("Data inválida", "nascimento");

    return !error;
}