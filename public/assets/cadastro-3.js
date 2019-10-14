$(function () {
    $("#arrowback").off("click").on("click", function () {
        history.back();
    });

    $("input[type='file']").off("change").on("change", function (e) {

        if (typeof e.target.files[0] !== "undefined") {
            file = e.target.files[0];

            let name = file.name.split(".");
            let extensao = name.pop().toLowerCase();
            name = name.join('-');
            let nome = name.replaceAll('-', ' ').replaceAll('_', ' ');
            name = slug(name);

            if (/^image\//.test(file.type)) {
                compressImage(file, 500, 500, webp("jpg"), function (resource) {
                    var size = parseFloat(4 * Math.ceil(((resource.length - 'data:image/png;base64,'.length) / 3)) * 0.5624896334383812).toFixed(1);

                    localStorage.medico3 = JSON.stringify({
                        "photo_64": resource
                    });

                    $("#foto").val(resource);
                    $("#cadastro-image2").html("<img src='" + resource + "' width='170' height='170' style='height: 170px;width: 170px;' />");
                });
            }
        }
        clearError("foto");
    });

    $("#termos").off("change keyup").on("change keyup", function () {
        clearError("termos");
    });

    if(localStorage.medico3) {
        let foto = JSON.parse(localStorage.medico3).photo_64;
        $("#foto").val(foto);
        $("#cadastro-image2").html("<img src='" + foto + "' width='170' height='170' style='height: 170px;width: 170px;' />");
    }
});

function openTermos() {
    lightbox("Lorem ipsum dolor sit amet, consectetur adipiscing elit. In quis libero quam. Fusce ac tortor sem. Aenean sit amet rutrum nisl. In sed lacus eget augue placerat tempor sit amet non lectus. Suspendisse eu dignissim diam. Donec eleifend mauris eu tortor placerat, id tempor tortor gravida. Duis sagittis, erat convallis consectetur tincidunt, dui mauris molestie nisi, in tristique mauris dolor eu nulla. Sed eleifend aliquet mi, ac egestas nulla aliquet tincidunt. Phasellus cursus lacus erat, eget dapibus odio molestie eu. Donec rhoncus ipsum ut tortor aliquet aliquet. Morbi vehicula condimentum finibus.\n" +
        "\n" +
        "Suspendisse non velit a tellus facilisis congue at a justo. Quisque imperdiet accumsan lectus nec faucibus. Praesent convallis congue odio at dignissim. Cras nec nibh est. Phasellus ligula tellus, egestas eu commodo et, elementum et ligula. Praesent vulputate sollicitudin neque at consectetur. Aliquam viverra, ligula in venenatis euismod, libero sem ornare arcu, ut tristique nisi magna eu lorem. Cras dictum tristique ex vitae placerat.\n" +
        "\n" +
        "Donec ac lorem nisl. Nunc vel sodales tortor. Proin lacinia lacinia consequat. Pellentesque non ex imperdiet, euismod ex vitae, porttitor mi. Praesent sit amet purus in erat molestie consequat. Nulla bibendum suscipit erat dictum ultricies. Phasellus consectetur ex lectus, quis euismod nisi interdum eget. Donec nec leo blandit, interdum quam non, varius est. Maecenas porta nisi nec pellentesque consectetur. Duis non bibendum justo. Sed eu odio sit amet justo malesuada aliquam. Maecenas bibendum sem id lectus aliquam, et vulputate augue sodales. Ut ornare at lacus eget condimentum. Donec vitae libero luctus ipsum dapibus maximus. Aliquam bibendum ante pulvinar maximus sodales. Donec scelerisque ligula sed ante tempus pharetra.\n" +
        "\n" +
        "Pellentesque eu tortor pharetra, lobortis magna ut, facilisis sem. Sed mollis ultricies tellus sit amet vulputate. Aliquam vel enim ut velit euismod condimentum. Mauris porta nunc non tortor scelerisque, sed semper nibh viverra. Etiam condimentum felis sed urna tempus, sed lobortis tortor vehicula. Mauris eu magna non nisi venenatis cursus in vitae nisi. Mauris a risus dignissim, elementum velit nec, molestie erat. Integer scelerisque, ligula ut condimentum efficitur, odio justo laoreet enim, ac tincidunt leo nunc vel nisi. Maecenas consectetur ex at nibh aliquet placerat. In finibus ipsum sit amet lorem rutrum finibus. Quisque tristique orci at libero egestas, nec porta leo interdum. Vivamus interdum, ipsum eget euismod auctor, ipsum sapien tincidunt ipsum, eu malesuada nulla eros vitae odio. Sed pretium tortor non diam gravida, in dictum elit rhoncus.\n" +
        "\n" +
        "Praesent volutpat iaculis pretium. Nam egestas libero orci, id aliquet nulla tincidunt quis. Donec vulputate porttitor ullamcorper. Vestibulum eu suscipit elit. Ut molestie velit quis elementum lacinia. Maecenas laoreet, turpis a tristique elementum, orci erat convallis augue, sed congue turpis eros id sem. Suspendisse scelerisque mollis purus eget tincidunt. Pellentesque erat nulla, luctus sed augue at, porta suscipit nisi. Morbi ut nisi est. Praesent laoreet libero massa, ut lacinia mi gravida vel."
    );
}

function avancar() {

    let medico3 = {
        "photo_64": $("#foto").val(),
        "termos": $("#termos").prop("checked")
    }

    if (validateMedico(medico3)) {
        // localStorage.medico = JSON.stringify(medico);
        // pageTransition(HOME + "cadastro-2", "route", "forward");

        let medico1 = JSON.parse(localStorage.medico);
        let medico2 = JSON.parse(localStorage.medico2);
        let birthday = medico1.birth_day.split("-");

        //enviar request
        let medico = {
            "email": medico1.email,
            "password": medico1.password,
            "name": medico1.name,
            "birth_day": birthday[2] + "-" + birthday[1] + "-" + birthday[0],
            "phone_number": medico1.phone_number,
            "crm": medico1.crm,
            "photo_64": medico3.photo_64
        }

        if(!medico2.nao1)
            medico.address1 = medico2.address1 + " - " + medico2.tel1;

        if(!medico2.nao2)
            medico.address2 = medico2.address2 + " - " + medico2.tel2;

        let data = {
            "route": {
                "action": "create",
                "module": "doctor"
            },
            "data": medico
        };

        $(".loginbtn").html("enviando...");
        toast("Enviando dados...", 10000);
        post("site-pstmc", "medico-create", {medico: medico}, function (g) {
            if(g) {
                localStorage.loginData = {
                    email: medico.email,
                    senha: medico.password
                };

                localStorage.removeItem('medico');
                localStorage.removeItem('medico2');
                localStorage.removeItem('medico3');

                toast("Cadastro realizado!", 2500, "toast-success");
                pageTransition(HOME + "login", "route", "forward");
            } else {
                $(".loginbtn").html("Concluir");
            }
        });
    }
}

var error = !1;
function validateMedico(medico) {
    error = !1;

    if(!medico.termos) {
        showError("Você precisa aceitar os termos", "termos");
        error = !0;
    }

    if(!localStorage.medico){
        error = !0;
        toast("Passo 1 ausênte", 300, "toast-warning", function () {
            pageTransition(HOME + "cadastro-usuario", "route", "back");
        });
    }

    if(!localStorage.medico2){
        error = !0;
        toast("Passo 2 ausênte", 300, "toast-warning", function () {
            pageTransition(HOME + "cadastro-2", "route", "back");
        });
    }

    return !error;
}

function showError(mensagem, id) {
    $(".input-message[rel='" + id + "']").html(mensagem).addClass("active");

    if(id === "foto")
        $("#cadastro-image1").css("border-color", "red");
    error = !0;
    navigator.vibrate(100);
}

function clearError(id) {
    $(".input-message[rel='" + id + "']").html("").removeClass("active");
    if(id === "foto")
        $("#cadastro-image1").css("border-color", "white");
}