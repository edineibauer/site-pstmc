var filtros = {dateStart: null, dateEnd: null, interval: 'month', indicadores: []};
var tpl = dbLocal.exeRead("__template", 1);
var paciente = readPaciente(ID);

var all = Promise.all([paciente, tpl]).then(r => {
    paciente = r[0];
    tpl = r[1];
});

/**
 * Add shadow on PIE type chart
 * */
var draw = Chart.controllers.pie.prototype.draw;
Chart.controllers.pie = Chart.controllers.pie.extend({
    draw: function () {
        draw.apply(this, arguments);
        let ctx = this.chart.chart.ctx;
        let _fill = ctx.fill;
        ctx.fill = function () {
            ctx.save();
            ctx.shadowColor = 'rgba(45,146,203,0.53)';
            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            _fill.apply(this, arguments)
            ctx.restore();
        }
    }
});

function chartGetDataMaker(data, fieldX, fieldY) {

    //Campo Y obrigatório
    if (typeof fieldY === "undefined" || fieldY === null || isEmpty(fieldY)) {
        toast("Gráfico não pode ser gerado! Coluna Y não informada", 7000, "toast-warning");
        return [];
    }

    let dadosTabela = [];

    if (typeof fieldX === "undefined" || fieldX === null || fieldX === "" || fieldX === "null") {

        //gráfico linear (sem linha de tempo, ex: gráfico em pizza) (sempre considera soma dos valores)

        if (fieldY.constructor === Array) {

            //soma dos campos do array (comparativo da soma dos valores entre os campos)
            $.each(data, function (i, e) {
                $.each(fieldY, function (ii, y) {
                    y = y.replace("SUM", "sum").replace("Sum", "sum").replace("sum(", "").replace(")", "");

                    //só considera valores numéricos em Y
                    if (typeof e[y] !== "undefined" && !isNaN(e[y])) {
                        if (typeof dadosTabela[y] === "undefined")
                            dadosTabela[y] = 0;

                        dadosTabela[y] += e[y];
                    }
                })
            });

        } else if (typeof fieldY === "string") {
            //soma dos dados de um campo (comparativo do número de registros com o mesmo valor)
            fieldY = fieldY.replace("SUM", "sum").replace("Sum", "sum").replace("sum(", "").replace(")", "");

            $.each(data, function (i, e) {
                if (typeof dadosTabela[e[fieldY]] === "undefined")
                    dadosTabela[e[fieldY]] = 0;

                dadosTabela[e[fieldY]]++;
            });
        }

    } else {

        if (fieldY.constructor === Array) {

            //lista de campos para comparar valores
            $.each(data, function (i, e) {
                $.each(fieldY, function (ii, y) {

                    //soma dos dados do um campo, garante que não informou sum aqui
                    y = y.replace("sum(", "").replace(")", "");

                    //só considera valores numéricos em Y
                    if (typeof e[y] !== "undefined" && !isNaN(e[y])) {
                        if (typeof dadosTabela[e[fieldX]] === "undefined") {
                            dadosTabela[e[fieldX]] = [];
                            dadosTabela[e[fieldX]][y] = 0;

                        } else if (typeof dadosTabela[e[fieldX]][y] === "undefined") {
                            dadosTabela[e[fieldX]][y] = 0;
                        }

                        dadosTabela[e[fieldX]][y] += e[y];
                    }
                })
            })

        } else if (typeof fieldY === "string") {

            let reg = new RegExp("^sum\\(", "i");
            if (fieldY === "sum" || reg.test(fieldY)) {

                //soma dos resultados
                if (fieldY === "sum" || fieldY === "sum()" || fieldY === "sum(*)") {

                    //soma dos registros
                    $.each(data, function (i, e) {
                        if (typeof dadosTabela[e[fieldX]] === "undefined")
                            dadosTabela[e[fieldX]] = 0;

                        dadosTabela[e[fieldX]]++;
                    })
                } else {

                    fieldY = fieldY.replace("sum(", "").replace(")", "");

                    //soma dos dados de um campo
                    $.each(data, function (i, e) {

                        //só considera valores numéricos em Y
                        if (typeof e[fieldY] !== "undefined" && !isNaN(e[fieldY])) {
                            if (typeof dadosTabela[e[fieldX]] === "undefined") {
                                dadosTabela[e[fieldX]] = [];
                                dadosTabela[e[fieldX]][fieldY] = 0;

                            } else if (typeof dadosTabela[e[fieldX]][fieldY] === "undefined") {
                                dadosTabela[e[fieldX]][fieldY] = 0;
                            }

                            dadosTabela[e[fieldX]][fieldY] += e[fieldY];
                        }
                    })
                }
            } else {

                //normal, cria lista com os registros
                $.each(data, function (i, e) {
                    if (typeof dadosTabela[e[fieldX]] === "undefined") {
                        dadosTabela[e[fieldX]] = [];
                        dadosTabela[e[fieldX]][e[fieldY]] = 0;
                    }

                    dadosTabela[e[fieldX]][e[fieldY]]++;
                })
            }
        }
    }

    return dadosTabela;
}

function operatorChartSetType(type) {
    let types = [];
    if (typeof type === "string" && ["line", "bar", "radar", "doughnut", "pie", "polarArea", "bubble", "scatter"].indexOf(type) > -1) {
        types.push(type);
    } else if (typeof type === "object" && type !== null && type.constructor === Array && !isEmpty(type)) {
        $.each(type, function (i, t) {
            if (typeof t === "string" && ["line", "bar", "radar", "doughnut", "pie", "polarArea", "bubble", "scatter"].indexOf(t) > -1)
                types.push(t);
        })
    }
    if (isEmpty(types))
        types.push("bar");

    return types;
}

function operatorChartConvertDataType(data, fieldY, fieldX, type, funcaoX, funcaoY) {

    funcaoX = typeof funcaoX === "function" ? funcaoX : (v) => {
        return v
    };
    funcaoY = typeof funcaoY === "function" ? funcaoY : (v) => {
        return v
    };

    let dd = [];
    labels = [];

    if (!isEmpty(fieldX)) {

        type = (["line", "bar", "scatter", "bubble"].indexOf(type[0]) > -1 ? type[0] : "bar");

        if (typeof fieldY === "object" && fieldY.constructor === Array && fieldY.length > 1) {
            for (let x in data) {
                if (typeof data[x] === "object") {
                    for (let i in data[x]) {
                        if (!isNaN(data[x][i])) {
                            if (typeof dd[i] === "undefined")
                                dd[i] = [];

                            dd[i].push({x: funcaoX(x), y: funcaoY(data[x][i])});
                        }
                    }
                }
            }

            if (type === "bubble") {
                $.each(dd, function (i, e) {
                    dd[i].r = e.y;
                })
            }

            data = [];
            for (let i in dd) {
                if (typeof dd[i] === "object") {
                    data.push({
                        label: i,
                        data: dd[i],
                        type: type
                    })
                }
            }

        } else {
            let bigger = -999999;
            let smaller = 99999999999;
            for (let x in data) {
                if (typeof data[x] === "object") {
                    for (let i in data[x]) {
                        if (!isNaN(data[x][i])) {
                            if (type === "bubble") {
                                if (funcaoX(x) == 25)
                                    data[x][i] = 23;
                                dd.push({x: funcaoX(x), y: funcaoY(i), r: data[x][i]});

                                if (bigger < data[x][i])
                                    bigger = data[x][i];
                                if (smaller > data[x][i])
                                    smaller = data[x][i];

                            } else {
                                dd.push({x: funcaoX(x), y: funcaoY(i)});
                            }
                        }
                    }
                }
            }

            if (type === "bubble") {
                let min = 5;
                let max = 30;
                $.each(dd, function (i, e) {
                    dd[i].r = ((dd[i].r * (max - min)) / bigger) + min;
                })
            }

            data = dd;
        }

    } else {
        /* RADAR, PIE, DOUGHNUT, POLARAREA */
        for (let x in data) {
            if (!isNaN(data[x])) {
                labels.push(x);
                dd.push(data[x]);
            }
        }
        data = dd;

        type = (["radar", "pie", "doughnut", "polarArea"].indexOf(type[0]) > -1 ? type[0] : "pie");
    }

    return [type, data, labels];
}

window.ChartMaker = function () {
    return {
        data: [],
        type: ["bar"],
        fieldX: null,
        fieldY: null,
        labels: [],
        stepY: 1,
        stepX: 1,
        minX: 0,
        minY: 0,
        maxX: null,
        maxY: null,
        functionLabelX: null,
        functionLabelY: null,
        functionTooltips: null,
        functionColor: null,
        borderWidth: 1,
        paddings: null,
        setData: data => {
            if (typeof data !== "undefined" && data !== null && data.constructor === Array)
                this.data = data;
        },
        setType: type => {
            this.type = operatorChartSetType(type);
        },
        setFieldX: x => {
            if (typeof x === "string")
                this.fieldX = x;
        },
        setFieldY: y => {
            if (typeof y === "string" || (typeof y !== "undefined" && y !== null && y.constructor === Array))
                this.fieldY = y;
        },
        setStepX: step => {
            if (!isNaN(step))
                this.stepX = step;
        },
        setStepY: step => {
            if (!isNaN(step))
                this.stepY = step;
        },
        setMinX: min => {
            if (!isNaN(min))
                this.minX = min;
        },
        setMaxX: max => {
            if (!isNaN(max))
                this.maxX = max;
        },
        setMinY: min => {
            if (!isNaN(min))
                this.minY = min;
        },
        setMaxY: max => {
            if (!isNaN(max))
                this.maxY = max;
        },
        setBoderWidth: b => {
            if (!isNaN(b))
                this.borderWidth = b;
        },
        setPaddings: p => {
            this.paddings = {top: 30, right: 30, bottom: 30, left: 30};
            if (typeof p === "object" && p.constructor === Object) {
                if (!isNaN(p.top))
                    this.paddings.top = p.top;
                if (!isNaN(p.right))
                    this.paddings.right = p.right;
                if (!isNaN(p.bottom))
                    this.paddings.bottom = p.bottom;
                if (!isNaN(p.left))
                    this.paddings.left = p.left;
            }
        },
        setFunctionLabelX: f => {
            if (typeof f === "function")
                this.functionLabelX = f;
        },
        setFunctionLabelY: f => {
            if (typeof f === "function")
                this.functionLabelY = f;
        },
        setFunctionTooltips: f => {
            if (typeof f === "function")
                this.functionTooltips = f;
        },
        setFunctionColor: f => {
            if (typeof f === "function")
                this.functionColor = f;
        },
        getChart: type => {
            if (isEmpty(this.data) || isEmpty(this.fieldY)) {
                toast("Gráfico Erro! Data ou campo Y ausente", 7000, "toast-warning");
                return "";
            }

            let $this = this;
            $this.labels = $this.labels || [];
            $this.paddings = $this.paddings || {top: 30, right: 30, bottom: 30, left: 30};
            $this.functionTooltips = typeof $this.functionTooltips === "function" ? $this.functionTooltips : function (x, y) {
                return y;
            };
            $this.functionColor = typeof $this.functionColor === "function" ? $this.functionColor : function (c) {
                return c;
            };
            $this.type = operatorChartSetType(type);
            $this.data = chartGetDataMaker($this.data, $this.fieldX, $this.fieldY);
            result = operatorChartConvertDataType($this.data, $this.fieldY, $this.fieldX || null, $this.type, $this.functionLabelX, $this.functionLabelY);
            $this.type = result[0];
            $this.data = result[1];
            $this.labels = result[2];
            delete result;

            console.log($this);

            let borderWidth = 1;
            let paddings = null;
            let labelsX = {};
            let labelsY = {};
            borderWidth = borderWidth || 1;
            labelsX = labelsX || {};
            labelsY = labelsY || {};

            let backgroundColor = [];
            let options = {
                layout: {
                    padding: $this.paddings
                },
                tooltips: {
                    callbacks: {
                        title: function (tooltipItem, data) {
                            return data.labels[tooltipItem[0].index];
                        }
                    }
                }
            };

            if(["radar", "pie", "doughnut", "polarArea"].indexOf($this.type) > -1) {

                //PIE
                $.each($this.labels, function (i, l) {
                    backgroundColor.push($this.functionColor(l));
                    $this.labels[i] = $this.functionTooltips(null, l);
                });

                options.tooltips.callbacks.label = function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    var total = meta.total;
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                    return ' ' + percentage + '% (' + currentValue + ')';
                };

                options.legend = {position: "left", reverse: !0};
            } else {

                //BAR
                backgroundColor = function (context) {
                    let value = context.dataset.data[context.dataIndex].y;
                    return $this.functionColor(value);
                };
                options.tooltips.callbacks.label = function (tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                    return ' ' + $this.functionTooltips(dataset.x, dataset.y);
                };

                options.legend = {
                    display: !1
                };

                options.aspectRatio = 3;
                options.scales = {
                    yAxes: [{
                        ticks: {
                            max: 10,
                            min: $this.minY || 0,
                            maxTicksLimit: 10,
                            stepSize: $this.stepY || 1,
                            display: !1
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            stepSize: $this.stepX || 1
                        }
                    }]
                }
            }

            let $canvas = $("<canvas></canvas>");
            let ctx = $canvas[0].getContext('2d');

            new Chart(ctx, {
                type: $this.type,
                data: {
                    datasets: [{
                        data: $this.data,
                        backgroundColor: backgroundColor,
                        pointRadius: 10,
                        pointHoverRadius: 12,
                    }],
                    labels: $this.labels
                },
                options: options
            });

            return $canvas;
        }
    };
};

function humorGrafico(mod) {
    dbLocal.exeRead("humor").then(g => {
        $("#grafico-humor").html(grafico('humor', g, mod));
    });
}

function graficoSono(registros, mod) {

    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldY("quality");
    grafico.setFunctionTooltips(function (x, y) {
        let humor = {
            "0": "triste",
            "2.5": 'chateado',
            "5": 'normal',
            "7.5": 'contente',
            "10": 'feliz'
        };
        return humor[y];
    });

    grafico.setFunctionColor(function (color) {
        let colorRef = {
            "0": "#6849B7",
            "2.5": '#FF5159',
            "5": '#606060',
            "7.5": '#7EC8BD',
            "10": '#2D92CB'
        };
        return colorRef[color];
    });

    grafico.setFieldX("date");
    grafico.setFunctionLabelX(function (valor) {
        return valor.split("-")[2];
    });

    $("#graficos").append(grafico.getChart("scatter"));
}

function graficoHumor(registros, mod) {

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldY("mood_type");
    grafico.setFunctionTooltips(function (x, y) {
        let humor = {
            "0": "triste",
            "2.5": 'chateado',
            "5": 'normal',
            "7.5": 'contente',
            "10": 'feliz'
        };
        return humor[y];
    });

    grafico.setFunctionColor(function (color) {
        let colorRef = {
            "0": "#6849B7",
            "2.5": '#FF5159',
            "5": '#606060',
            "7.5": '#7EC8BD',
            "10": '#2D92CB'
        };
        return colorRef[color];
    });

    if(mod === 1) {

        /* SCATTER */
        $content.append(Mustache.render(tpl.graficoHumor, {}));
        grafico.setFieldX("date");
        grafico.setStepY(2.5);
        grafico.setPaddings({left: 50, right: 20, bottom: 10, top: 20});
        grafico.setFunctionLabelX(function (valor) {
            return valor.split("-")[2];
        });

        $content.append(grafico.getChart("scatter"));
    } else {

        /* PIE */
        $content.append(Mustache.render(tpl.graficoHumor2, {}));
        $content.append(grafico.getChart("pie"));
    }

    return $content;
}

function grafico(indicador, registros, mod) {

    switch (indicador) {
        case 'humor':
            return graficoHumor(registros, mod);
            break;
        case 'sono':
            return graficoSono(registros, mod);
            break;
    }
}

function graficoHeader(indicador) {
    let startDate = {day: '', month: '', year: ''};
    let endDate = {day: '', month: '', year: ''};
    if (haveDate = filtros.dateStart && filtros.dateEnd) {
        startDate = filtros.dateStart.split("-");
        startDate = {day: startDate[2], month: startDate[1], year: startDate[0]};
        endDate = filtros.dateEnd.split("-");
        endDate = {day: endDate[2], month: endDate[1], year: endDate[0]};
    }

    return Mustache.render(tpl.graficoHeader, {
        indicador: indicador,
        startDate: startDate,
        endDate: endDate,
        haveDate: haveDate
    });
}

function graficos() {
    $("#graficos").html("");

    return Promise.all([all]).then(() => {
        if (isEmpty(filtros.indicadores)) {
            $("#graficos").html(Mustache.render(tpl.pacienteGraficoEmpty, {HOME: HOME, VENDOR: VENDOR}));

        } else {
            $.each(filtros.indicadores, function (ii, indicador) {
                if (!isEmpty(paciente)) {
                    dbLocal.exeRead(indicador).then(g => {
                        if(g) {
                            $("#graficos")
                                .append(graficoHeader(indicador))
                                .append("<div class='col relative' id='grafico-" + indicador + "'></div><div class='col padding-8'></div>");
                            $("#grafico-" + indicador).html(grafico(indicador, g, 1));
                        }
                    });
                    post("site-pstmc", "read-" + indicador, {
                        paciente: paciente,
                        interval: filtros.interval
                    }, function (g) {
                        if (g) {
                            $.each(g, function (i, e) {
                                dbLocal.exeCreate(indicador, e);
                            });

                            if(!$("#grafico-" + indicador).length) {
                                $("#graficos")
                                    .append(graficoHeader(indicador))
                                    .append("<div class='col relative' id='grafico-" + indicador + "'></div><div class='col padding-8'></div>");

                                $("#grafico-" + indicador).html(grafico(indicador, g, 1));
                            }
                        }
                    });
                }
            });
        }
    });
}

/*
    let labelMes = {
        1: "Jan",
        2: "Fev",
        3: "Mar",
        4: "Abr",
        5: "Mai",
        6: "Jun",
        7: "Jul",
        8: "Ago",
        9: "Set",
        10: "Out",
        11: "Nov",
        12: "Dez"
    };
    let labelDiaMes = {1: "01", 2: "02", 3: "03", 4: "04", 5: "05", 6: "06", 7: "07", 8: "08", 9: "09", 10: "10"};

    */

/**
 * CHART DRAW X Y
 * */
function chartDraw(target, data, labelsX, labelsY, colorRef, type, borderWidth, paddings) {
    type = type || "scatter";
    borderWidth = borderWidth || 1;
    paddings = paddings || {top: 30, right: 30, bottom: 30, left: 30};
    labelsX = labelsX || {};
    labelsY = labelsY || {};

    let $grafico = $("<canvas></canvas>").appendTo(target);
    let ctx = $grafico[0].getContext('2d');

    new Chart(ctx, {
        type: type,
        data: {
            datasets: [{
                data: data,
                backgroundColor: function (context) {
                    let index = context.dataIndex;
                    let value = context.dataset.data[index].y;
                    return colorRef[value];
                },
                pointRadius: 10,
                pointHoverRadius: 12,
            }]
        },
        options: {
            legend: {
                display: !1
            },
            aspectRatio: 3,
            layout: {
                padding: paddings
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                        var total = meta.total;
                        var valueY = dataset.data[tooltipItem.index].y;
                        var valueX = dataset.data[tooltipItem.index].x;
                        return ' ' + (!isEmpty(labelsY) && typeof labelsY[valueY] !== "undefined" ? labelsY[valueY] : valueY)
                            + (!isEmpty(labelsX) && typeof labelsX[valueX] !== "undefined" ? " " + labelsX[valueX] : valueX);
                    },
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            },
            scales: {
                yAxes: [{
                    ticks: {
                        max: 10,
                        min: 0,
                        maxTicksLimit: 10,
                        stepSize: 2.5,
                        display: !1
                    }
                }],
                xAxes: [{
                    ticks: {
                        stepSize: 1
                    }
                }]
            }
        }
    });
}

/**
 * SUM FUNCTION PERCENT
 * */
function chartSumPercert(target, data, field, labelRef, colorRef, type, borderWidth, paddings) {

    /**
     * Inicializa variáveis
     * */
    borderWidth = borderWidth || 1;
    paddings = paddings || {top: 30, right: 30, bottom: 30, left: 30};
    type = type || 'pie';
    let total = [];
    let grafico = {
        labels: [],
        colors: [],
        data: [],
    };

    /**
     * Constrói lista com dados com base no campo field
     */
    $.each(data, function (i, e) {
        if (typeof total[e[field]] !== "undefined")
            total[e[field]]++;
        else
            total[e[field]] = 1;
    });

    /**
     * Aplica os dados, labels e colors dos dados listados
     */
    $.each(total, function (i, e) {
        if (typeof e !== "undefined") {
            grafico.labels.push(labelRef[i]);
            grafico.colors.push(colorRef[i]);
            grafico.data.push(e);
        }
    });

    let $grafico = $("<canvas></canvas>").appendTo(target);
    new Chart($grafico[0].getContext('2d'), {
        type: type,
        data: {
            labels: grafico.labels,
            datasets: [{
                data: grafico.data,
                backgroundColor: grafico.colors,
                borderWidth: borderWidth
            }]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: function (tooltipItem, data) {
                        var dataset = data.datasets[tooltipItem.datasetIndex];
                        var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                        var total = meta.total;
                        var currentValue = dataset.data[tooltipItem.index];
                        var percentage = parseFloat((currentValue / total * 100).toFixed(1));
                        return ' ' + percentage + '% (' + currentValue + ')';
                    },
                    title: function (tooltipItem, data) {
                        return data.labels[tooltipItem[0].index];
                    }
                }
            },
            layout: {
                padding: paddings
            },
        }
    });
}

$(function () {
    readPaciente(ID).then(paciente => {
        if (!isEmpty(paciente)) {
            dbLocal.exeRead("__template", 1).then(tpl => {
                $("#paciente-info").html(Mustache.render(tpl.pacientePerfil, paciente))
            })
        }
    });
    $("#date-start").off("change").on("change", function () {
        filtros.dateStart = $(this).val();
        graficos()
    });
    $("#date-end").off("change").on("change", function () {
        filtros.dateEnd = $(this).val();
        graficos()
    });
    $(".time-week").off("click").on("click", function () {
        $(".time-week").removeClass("active");
        $(this).addClass("active");
        filtros.interval = $(this).attr("rel");
        graficos()
    });
    $(".indicador").off("click").on("click", function () {
        let v = $(this).attr("rel");
        if (filtros.indicadores.indexOf(v) > -1) {
            filtros.indicadores.removeItem(v);
            $(this).removeClass("active")
        } else {
            if (filtros.indicadores.length > 1) {
                let id = filtros.indicadores[0];
                filtros.indicadores.splice(0, 1);
                $(".indicador[rel='" + id + "']").removeClass("active")
            }
            filtros.indicadores.push(v);
            $(this).addClass("active");
        }
        graficos();
    });
    graficos()
})