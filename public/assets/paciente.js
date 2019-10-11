var filtros = {
    dateStart: null,
    dateEnd: null,
    timeWeek: 'year',
    indicadores: []
};

function grafico() {

    if(isEmpty(filtros.indicadores)) {
        dbLocal.exeRead("__template", 1).then(tpl => {
            $("#graficos").html(Mustache.render(tpl.pacienteGraficoEmpty, {HOME: HOME, VENDOR:VENDOR}));
        });
    } else {
        let content = "";
        if(filtros.dateStart)
            content += "<span class='col padding-small'>Gráficos começam a partir de: " + filtros.dateStart + "</span>";
        if(filtros.dateEnd)
            content += "<span class='col padding-small'>Gráficos terminam em: " + filtros.dateEnd + "</span>";

        content += "<span class='col padding-small'>Você escolheu filtrar por: " + filtros.timeWeek + "</span>";

        $.each(filtros.indicadores, function (i, e) {
            content += "<span class='col padding-small'>Você selecionou " + e + "</span>";
        });
        $("#graficos").html(content);
    }
}

$(function () {
    readPaciente(ID).then(paciente => {
        if (!isEmpty(paciente)) {
            dbLocal.exeRead("__template", 1).then(tpl => {
                $("#paciente-info").html(Mustache.render(tpl.pacientePerfil, paciente));
            });
        }
    });

    $("#date-start").off("change").on("change", function () {
        filtros.dateStart = $(this).val();
        grafico();
    });

    $("#date-end").off("change").on("change", function () {
        filtros.dateEnd = $(this).val();
        grafico();
    });

    $(".time-week").off("click").on("click", function () {
        $(".time-week").removeClass("active");
        $(this).addClass("active");
        filtros.timeWeek = $(this).attr("rel");
        grafico();
    });

    $(".indicador").off("click").on("click", function () {
        let v = $(this).attr("rel");
        if(filtros.indicadores.indexOf(v) > -1) {
            filtros.indicadores.removeItem(v);
            $(this).removeClass("active");
        } else {
            if(filtros.indicadores.length > 1) {
                let id = filtros.indicadores[0];
                filtros.indicadores.splice(0, 1);
                $(".indicador[rel='" + id + "']").removeClass("active");
            }
            filtros.indicadores.push(v);
            $(this).addClass("active");
        }
        grafico();
    });

    grafico();
});