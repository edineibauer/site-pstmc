//variável para máscara de telefone
var SPMaskBehavior = function (val) {
    return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009'
}, spOptions = {
    onKeyPress: function (val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options)
    }
};

var lightboxTop = null;
function lightbox(content) {
    $(".core-overlay").css({"opacity": 1, "transform": "translateX(0)"});
    $("#core-overlay-content").html(content);
    $("#core-overlay-div").css({"opacity": 1, "transform": "translateX(0)"});
    lightboxTop = setInterval(function () {
        let top = (window.innerHeight - $("#core-overlay-content")[0].clientHeight) / 2;
        $("#core-overlay-content").css("top", top + "px");
    }, 50);
}

function updatePerfilPage() {
    $(".perfil-photo_64").attr("src", (!localStorage.photo_64 || localStorage.photo_64 === "null" || localStorage.photo_64 === "" ? HOME + "uploads/site/image-not-found.png" : localStorage.photo_64));
    $(".perfil-name").html(localStorage.name && localStorage.name !== "null" ? localStorage.name : "");
    $(".perfil-crm").html(localStorage.crm && localStorage.crm !== "null" ? localStorage.crm : "");
    $(".perfil-cpf").html(localStorage.cpf && localStorage.cpf !== "null" ? localStorage.cpf : "");
    $(".perfil-birthday").html(localStorage.birthday.replace("-", "/").replace("-", "/"));
    $(".perfil-email").html(localStorage.email && localStorage.email !== "null" ? localStorage.email : "");
    $(".perfil-phone_number").html(localStorage.phone_number && localStorage.phone_number !== "null" ? localStorage.phone_number : "");

    if(localStorage.address1 && localStorage.address1 !== "null") {
        let a = localStorage.address1.split(" - ");
        let tel = a[a.length - 1].trim();
        $(".perfil-tel1").html(tel);
        $(".perfil-address1").html(localStorage.address1.replace(" - " + tel, ""));
    }

    if(localStorage.address2 && localStorage.address2 !== "null") {
        a = localStorage.address2.split(" - ");
        tel = a[a.length - 1].trim();
        $(".perfil-tel2").html(tel);
        $(".perfil-address2").html(localStorage.address2.replace(" - " + tel, ""));
    }

    $(".perfil-phone_number, .perfil-tel1, .perfil-tel2").mask(SPMaskBehavior, spOptions);
    $(".perfil-cpf").mask('999.999.999-99', {reverse: !0});

    setTimeout(function () {
        $(".perfil-phone_number, .perfil-tel1, .perfil-tel2, .perfil-cpf").trigger("input");
    }, 100);
}

function menuHeader() {
    loginBtn();
    return dbLocal.exeRead("__template", 1).then(tpl => {
        menuBottom(tpl);
        let menu = [];
        if (getCookie("token") !== "" && getCookie("token") !== "0") {
            menu.push({
                href: HOME + 'dashboard" data-animation="forward',
                rel: 'dashboard',
                class: 's-hide menu-ep',
                text: "<i class='material-icons left'>home</i> Início"
            });
            menu.push({
                href: HOME + 'pacientes" data-animation="forward',
                rel: 'pacientes',
                class: 's-hide menu-ep',
                text: "<i class='material-icons left'>hdr_strong</i> Pacientes"
            });
            menu.push({
                href: HOME + 'perfil" data-animation="forward',
                rel: 'perfil',
                class: 's-hide menu-ep',
                text: "<i class='material-icons left'>person</i> Seu perfil"
            });
            menu.push({
                href: HOME + 'ajustes" data-animation="forward',
                rel: 'ajustes',
                class: 's-hide menu-ep',
                text: "<i class='material-icons left'>settings_applications</i> Ajustes"
            });
            if (getCookie("setor") === "admin") {
                menu.push({
                    href: HOME + 'UIDev',
                    rel: 'UIDev',
                    class: 's-hide',
                    text: "<i class='material-icons left'>settings</i>"
                });
                menu.push({
                    href: HOME + 'UIEntidades',
                    class: 's-hide',
                    rel: 'UIEntidades',
                    text: "<i class='material-icons left'>accessibility_new</i>"
                })
            }
            menu.push({
                rel: '',
                funcao: '',
                class: 'nomeHeader',
                text: "<div class='core-class-container' style='font-weight: bold'><div class='perfil-name' style='float: right'></div><div style='float: right;padding-right: 5px'>Dr. </div></div><div class='core-class-container'><div style='float:right;font-weight:bold;font-size: 11px'><div style='padding-right: 5px'>CRM </div><div class='perfil-crm'></div></div><div style='float:right;padding-right:15px' class='perfil-address1'></div></div>"
            });
        }
        menu.push({
            rel: '',
            funcao: 'toggleSidebar',
            class: '',
            text: "<img src='' class='perfil-photo_64' style='border-radius: 50%;margin: 5px 0 0 -30px; height: 44px;width: 44px' />"
        });
        let content = "";
        for (let m in menu) {
            if (typeof menu[m].text === "string" && menu[m].text !== "undefined") {
                if (typeof menu[m].href === "undefined" && typeof menu[m].funcao === "string") {
                    content += tpl['menu-header-funcao'].replace("{{funcao}}", menu[m].funcao).replace("{{rel}}", menu[m].rel).replace("{{{text}}}", menu[m].text).replace("{{class}}", menu[m].class).replace("{{class}}", menu[m].class + " theme-text-aux")
                } else {
                    content += tpl['menu-header-href'].replace("{{href}}", menu[m].href).replace("{{rel}}", menu[m].rel).replace("{{{text}}}", menu[m].text).replace("{{class}}", menu[m].class).replace("{{class}}", menu[m].class + " theme-text-aux")
                }
            }
        }
        document.querySelector("#core-menu-custom").innerHTML = content
    })
}

$(function () {
    updatePerfilPage();

    $("#core-overlay-div").off("click").on("click", function(e) {
        if (e.target !== this)
            return;

        clearInterval(lightboxTop);

        $(".core-overlay").css({"opacity": 0, "transform": "translateX(-100%)"});
        $("#core-overlay-div").css({"opacity": 0, "transform": "translateX(-100%)"});
        $("#core-overlay-content").html("");
    });
});