/**
 * Ler paciente
 * */
function readPaciente(retry) {
    dbLocal.exeRead("pacientes", ID).then(d => {
        if(!isEmpty(d)) {
            console.log(d);
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
 * Obter lista de pacientes
 * */
function getPacientes() {
    return get("read-pacientes").then(p => {
        let aa = [];
        if(!isEmpty(p)) {
            $.each(p, function (i, e) {
                e.patient.idade = idade(e.patient.birthday);
                let image = (e.patient.gender === "F" ? "woman" : "man") + Math.floor((Math.random() * 9) + 1);
                e.patient.imagem = (typeof e.patient.photo_64 !== "undefined" && e.patient.photo_64 !== "null" && !isEmpty(e.patient.photo_64) ? e.patient.photo_64 : HOME + VENDOR + DOMINIO + "/public/assets/img/people/" + image + ".png");
                aa.push(dbLocal.exeCreate('pacientes', e.patient));
            });
        }

        return Promise.all(aa);
    });
}

$(function () {
    readPaciente();
});