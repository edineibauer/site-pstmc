function editPerfil() {
    $("#perfil, #core-header-container").addClass("hide");
    $("#edit-perfil").removeClass("hide");

    $("#core-header, #core-content").addClass("transition").removeClass("theme").css("background", "#3B3B3B");
    animateFadeEffect("#edit-perfil");
}

function closePerfil() {
    $("#edit-perfil").addClass("hide");
    $("#perfil, #core-header-container").removeClass("hide");

    $("#core-header, #core-content").css("background", "#ffffff");
    setTimeout(function () {
        $("#core-header, #core-content").removeClass("transition");
    }, 300);
}

function changeField(id) {
    if (id === "senha2")
        id = "senha";

    clearError(id);
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

    if (medico.name.length < 3)
        showError("Nome muito curto", "nome");

    if (medico.crm.length < 3)
        showError("CRM muito curto", "crm");

    if (medico.phone_number.length < 10)
        showError("Telefone inválido", "telefone");

    if (!isEmail(medico.email))
        showError("Email inválido", "email");

    if (!isCPF(medico.cpf))
        showError("CPF inválido", "cpf");

    if ($("#senha").val() !== "" && $("#senha").val() !== $("#senha2").val())
        showError("Senha não confere", "senha");

    if (typeof medico.name !== "string" || medico.name === "")
        showError("Preencha este campo", "nome");

    if (typeof medico.email !== "string" || medico.email === "")
        showError("Preencha este campo", "email");

    if (typeof medico.cpf !== "string" || medico.cpf === "")
        showError("Preencha este campo", "cpf");

    if (typeof medico.crm !== "string" || medico.crm === "")
        showError("Preencha este campo", "crm");

    if (typeof medico.phone_number !== "string" || medico.phone_number === "")
        showError("Preencha este campo", "telefone");

    if (typeof medico.birth_day !== "string" || medico.birth_day === "")
        showError("Preencha este campo", "nascimento");

    let reg = new RegExp("^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$", "i");
    if(!reg.test(medico.birth_day))
        showError("Data inválida", "nascimento");

    if(medico.address1 !== "" && medico.address1.length < 5)
        showError("Endereço muito curto", "address1");

    if(medico.address2 !== "" && medico.address2.length < 5)
        showError("Endereço muito curto", "address2");

    if(medico.tel1 !== "" && medico.tel1.length < 10)
        showError("Telefone inválido", "tel1");

    if(medico.tel2 !== "" && medico.tel2.length < 10)
        showError("Telefone inválido", "tel2");

    if(medico.address1 !== "" && medico.tel1 === "")
        showError("Preencha este campo", "tel1");

    if(medico.address2 !== "" && medico.tel2 === "")
        showError("Preencha este campo", "tel2");

    if(medico.address1 === "" && medico.tel1 !== "")
        showError("Preencha este campo", "address1");

    if(medico.address2 === "" && medico.tel2 !== "")
        showError("Preencha este campo", "address2");

    return !error;
}

function setDataperfil() {
    if(localStorage.imagem && localStorage.imagem !== "null" && !isEmpty(localStorage.imagem))
        $("#cadastro-image2").html("<img src='" + localStorage.imagem + "' width='150' height='150' style='height: 150px;width: 150px;' />");

    if(localStorage.name && localStorage.name !== "null" && !isEmpty(localStorage.name))
        $("#nome").val(localStorage.name);

    if(localStorage.birthday && localStorage.birthday !== "null" && !isEmpty(localStorage.birthday)) {
        $("#nascimento").val(localStorage.birthday.replace('-', '/').replace('-', '/'));
    }

    if(localStorage.email && localStorage.email !== "null" && !isEmpty(localStorage.email))
        $("#email").val(localStorage.email);

    if(localStorage.cpf && localStorage.cpf !== "null" && !isEmpty(localStorage.cpf))
        $("#cpf").val(localStorage.cpf);

    if(localStorage.phone_number && localStorage.phone_number !== "null" && !isEmpty(localStorage.phone_number))
        $("#telefone").val(localStorage.phone_number);

    if(localStorage.crm && localStorage.crm !== "null" && !isEmpty(localStorage.crm))
        $("#crm").val(localStorage.crm);

    if(localStorage.address1 && localStorage.address1 !== "null" && !isEmpty(localStorage.address1)){
        let a = localStorage.address1.split(" - ");
        let tel = a[a.length - 1].trim();
        $("#tel1").val(tel);
        $("#address1").val(localStorage.address1.replace(" - " + tel, ""));
    }

    if(localStorage.address2 && localStorage.address2 !== "null" && !isEmpty(localStorage.address2)){
        let a = localStorage.address2.split(" - ");
        let tel = a[a.length - 1].trim();
        $("#tel2").val(tel);
        $("#address2").val(localStorage.address2.replace(" - " + tel, ""));
    }

    if(localStorage.photo_64 !== "")
        $("#foto").val(localStorage.photo_64);

    $("input[type='tel']").mask(SPMaskBehavior, spOptions);
    $(".cpf").mask('999.999.999-99', {reverse: !0});

    setTimeout(function () {
        $("input[type='tel'], .cpf").trigger("change");
        $("input[type='tel'], .cpf").trigger("input");
    }, 100);
}

function sendDataToLocalStorage(medico) {
    localStorage.imagem = medico.photo_64;
    localStorage.photo_64 = medico.photo_64;
    localStorage.nome = medico.name;
    localStorage.name = medico.name;
    localStorage.email = medico.email;
    localStorage.birthday = medico.birth_day;
    localStorage.phone_number = medico.phone_number;
    localStorage.crm = medico.crm;
    localStorage.cpf = medico.cpf;
    localStorage.address1 = medico.address1;
    localStorage.address2 = medico.address2;
}

function salvarPerfil() {

    let medico = {
        "name": $("#nome").val(),
        "email": $("#email").val(),
        "cpf": $("#cpf").cleanVal(),
        "birth_day": $("#nascimento").val(),
        "phone_number": $("#telefone").cleanVal(),
        "crm": $("#crm").val(),
        "address1": $("#address1").val(),
        "address2": $("#address2").val(),
        "tel1": $("#tel1").cleanVal(),
        "tel2": $("#tel2").cleanVal(),
        "photo_64": $("#foto").val()
    };

    if(validateMedico(medico)) {
        medico.id = localStorage.id;
        medico.address1 += " - " + medico.tel1;
        medico.address2 += " - " + medico.tel2;
        medico.birth_day = medico.birth_day.replace('/', '-').replace('/', '-');
        delete medico.tel1;
        delete medico.tel2;

        if($("#senha").val() !== "")
            medico.password = $("#senha").val();

        sendDataToLocalStorage(medico);

        $(".loginbtn").html("enviando...");
        toast("Enviando dados...", 10000);
        post("site-pstmc", "medico-update", {medico: medico}, function (g) {
            if (g) {
                toast("Cadastro atualizado!", 2500, "toast-success");
                updatePerfilPage();
                closePerfil();
            } else {
                $(".loginbtn").html("Salvar");
            }
        });
    } else {
        toast("Corrija o formulário", 2500, "toast-warning");
    }
}

$(function () {

    //carrega dados de usuário para mostrar na página
    updatePerfilPage();

    //habilitar campos de "login", para não autocompletar
    setTimeout(function () {
        $("input[type='email'], input[type='password']").removeAttr("disabled");
    }, 500);

    //voltar btn
    $("#arrowback").off("click").on("click", function () {
        closePerfil();
    });

    //atualizar valores ao mudar campos
    $("input:not([type='file'])").off("change keyup").on("change keyup", function () {
        changeField($(this).attr("id"));
    });

    $("input[type='file']").off("change").on("change", function (e) {
        if (typeof e.target.files[0] !== "undefined") {
            file = e.target.files[0];
            if (/^image\//.test(file.type)) {
                compressImage(file, 500, 500, webp("jpg"), function (resource) {
                    $("#foto").val(resource);
                    $("#cadastro-image2").html("<img src='" + resource + "' width='150' height='150' style='height: 150px;width: 150px;' />");
                });
            }
        }
        clearError("foto");
    });

    //carrega dados para edição
    setDataperfil();
});