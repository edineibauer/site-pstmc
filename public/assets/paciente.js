var chartFilter = {dateStart: null, dateEnd: null, interval: 'month', indicadores: []};
var tpl = dbLocal.exeRead("__template", 1);
var paciente = readPaciente(ID);

var all = Promise.all([paciente, tpl]).then(r => {
    paciente = r[0];
    tpl = r[1];
});

function getDayOfWeek(date) {
    var dayOfWeek = new Date(date).getDay();
    return isNaN(dayOfWeek) ? null : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'][dayOfWeek];
}

function getDayofMonth(date) {
    var dayOfMonth = new Date(date).getMonth();
    return isNaN(dayOfMonth) ? null : ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][dayOfMonth];
}

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

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getXvalue(fieldX) {
    let dateCheck = new RegExp("^\\d{4}-\\d{2}-\\d{2}(\\s\\d{2}:\\d{2}:\\d{2})*$", "i");
    let x = fieldX;

    //verifica se X é uma data
    if (dateCheck.test(fieldX)) {
        let d = fieldX.split("-");

        if (chartFilter.interval === "year") {
            x = getDayofMonth(fieldX);
        } else if (chartFilter.interval === "month") {
            x = zeroEsquerda(parseInt(d[2]));
        } else if (chartFilter.interval === "week") {
            x = getDayOfWeek(fieldX);
        } else {
            x = zeroEsquerda(parseInt(d[2]));
        }
    }

    return x;
}

function roundStep(number, increment) {
    increment = increment || 1;
    return Math.round((number - increment) / increment) * increment + increment;
}

function privateChartGetDataMakerXY(chart) {
    let dadosTabela = [];
    let count = [];

    //normal, cria lista com os registros
    $.each(chart.data, function (i, e) {

        let x = e[chart.fieldX];
        let y = e[chart.fieldY];

        if (chartFilter.interval === "year" && chart.fieldDate) {
            let xx = x.split('-');
            x = xx[0] + "-" + xx[1] + "-15";
        } else if (chartFilter.interval === "day" && chart.fieldDate) {
            let dateCheck = new RegExp("^\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}$", "i");
            if (!dateCheck.test(x))
                x += " " + zeroEsquerda(i) + ":00";
        }

        if (typeof y !== "undefined" && y !== null && y !== "") {
            if (chart.operacao === "sum" || chart.operacao === "media") {
                dadosTabela[x] = (!isNaN(y) ? (typeof dadosTabela[x] === "undefined" ? y : dadosTabela[x] + y) : 0);

                if (chart.operacao === "media")
                    count[x] = (typeof count[x] === "undefined" ? 1 : count[x] + 1);

            } else {
                if (typeof dadosTabela[x] === "undefined")
                    dadosTabela[x] = [];

                if (chart.operacao === "maioria") {
                    dadosTabela[x][y] = (typeof dadosTabela[x][y] === "undefined" ? 1 : dadosTabela[x][y] + 1);

                    if (typeof count[x] === "undefined")
                        count[x] = [];

                    count[x][fieldY] = (typeof count[x][fieldY] === "undefined" ? 1 : count[x][fieldY] + 1);
                } else {
                    // if(dadosTabela[x].indexOf(y) === -1)
                    dadosTabela[x].push(y);
                }
            }
        }
    });

    for (let x in dadosTabela) {
        if (chart.operacao === "media") {
            /**
             * Tira a média do valor do campo
             */
            dadosTabela[x] = (chart.roundValueStepY ? roundStep(dadosTabela[x] / count[x], chart.stepY) : dadosTabela[x] / count[x]);

        } else if (chart.operacao === "maioria") {
            /**
             * Busca a informação do campo que mais apareceu no período
             */
            let maioria = {y: "", valor: -1};

            for (let y in dadosTabela[x]) {
                if (dadosTabela[x][y] > maioria.valor)
                    maioria = {y: y, valor: dadosTabela[x][y]};
            }

            dadosTabela[x] = (chart.roundValueStepY ? roundStep(maioria.y, chart.stepY) : maioria.y);

        } else {
            /**
             * Somente arredonda valor caso necessário
             */
            dadosTabela[x] = (chart.roundValueStepY ? roundStep(dadosTabela[x], chart.stepY) : dadosTabela[x]);
        }
    }

    return dadosTabela;
}

function privateChartGetDataMakerXYMult(chart) {
    let dadosTabela = [];

    //lista de campos para comparar valores
    $.each(chart.data, function (i, e) {
        $.each(chart.fieldY, function (ii, y) {
            //só considera valores numéricos em Y
            if (typeof e[y] !== "undefined" && !isNaN(e[y])) {
                if (typeof dadosTabela[e[chart.fieldX]] === "undefined") {
                    dadosTabela[e[chart.fieldX]] = [];
                    dadosTabela[e[chart.fieldX]][y] = 0;

                } else if (typeof dadosTabela[e[chart.fieldX]][y] === "undefined") {
                    dadosTabela[e[chart.fieldX]][y] = 0;
                }

                dadosTabela[e[chart.fieldX]][y] += e[y];
            }
        })
    })

    return dadosTabela;
}

function privateChartGetDataMakerY(chart) {
    let dadosTabela = [];
    let dd = [];

    /**
     * Coleta dos dados
     */
    $.each(chart.data, function (i, e) {
        let y = chart.functionValueY(chart.roundValueStepY ? roundStep(e[chart.fieldY], chart.stepY) : e[chart.fieldY]);
        if (typeof dd[y] === "undefined")
            dd[y] = 0;

        dd[y]++;
    });

    /**
     * Ordenação dos dados
     */
    let ddd = [];
    for (let x in dd)
        ddd.push({x: x, y: dd[x]});

    ddd = chartDataOrder(ddd, "x").reverse();

    /**
     * Exportação dos dados
     */
    for (let x in ddd) {
        chart.labels.push(ddd[x].x);
        chart.backgroundColor.push(chart.functionColor(ddd[x].x));
        dadosTabela.push(ddd[x].y);
    }

    return dadosTabela;
}

function privateChartGetDataMakerYMult(chart) {
    let dadosTabela = [];

    //soma dos campos do array (comparativo da soma dos valores entre os campos)
    $.each(chart.data, function (i, e) {
        $.each(chart.fieldY, function (ii, y) {
            //só considera valores numéricos em Y
            if (typeof e[y] !== "undefined" && !isNaN(e[y])) {
                if (typeof dadosTabela[y] === "undefined")
                    dadosTabela[y] = 0;

                dadosTabela[y] += e[y];
            }
        })
    });

    return dadosTabela;
}

function privateChartGetWeeks() {
    return ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];
}

function privateChartGetMonths() {
    return ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
}

function privateChartGetNumberDaysMonth(month) {
    if (month === 1)
        return 28;

    if ([3, 5, 8, 10].indexOf(month) > -1)
        return 30;

    return 31;
}

function getDates(startDate, stopDate) {
    startDate = new Date(startDate + " 23:59:59");
    stopDate = new Date(stopDate + " 23:59:59");
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

function privateChartGetLabelsDate() {
    if (chartFilter.interval === "week")
        return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    else if (chartFilter.interval === "month")
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
    else if (chartFilter.interval === "year")
        return ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    else
        return ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
}

function privateChartGetIntervalDate() {
    let intervalo = [];
    let dateAtual = chartFilter.dateStart;
    while (dateAtual <= chartFilter.dateEnd) {
        intervalo.push(dateAtual);

        let now = new Date(dateAtual + " 23:59:59");
        let dateLimit = new Date(now.setDate(now.getDate() + 1));
        dateAtual = dateLimit.getFullYear() + "-" + zeroEsquerda(dateLimit.getMonth() + 1) + "-" + zeroEsquerda(dateLimit.getDate());
    }
    return intervalo;
}

function privateChartGetDataMaker(chart) {
    /**
     * Verifica se campos obrigatórios foram informados
     */
    if (typeof chart.fieldY === "undefined" || chart.fieldY === null || isEmpty(chart.fieldY)) {
        toast("Gráfico não pode ser gerado! Coluna Y não informada", 7000, "toast-warning");
        return [];
    }

    /**
     * Ordena registros por X
     */
    if (typeof chart.fieldX !== "undefined" || typeof chart.fieldDate !== "undefined")
        chart.data = chartDataOrder(chart.data, chart.fieldX || chart.fieldDate);

    /**
     * Limitar dados com base na data inicial e final
     */
    if (chart.fieldDate) {
        let dd = [];
        $.each(chart.data, function (i, e) {
            if ((isEmpty(chartFilter.dateStart) || e[chart.fieldDate] >= chartFilter.dateStart) && (isEmpty(chartFilter.dateEnd) || e[chart.fieldDate] <= chartFilter.dateEnd))
                dd.push(e);
        });
        chart.data = dd.reverse();
        delete dd;
    } else {
        chart.data = chart.data.reverse();
    }

    let dadosTabela = [];
    if (typeof chart.fieldX === "undefined" || chart.fieldX === null || chart.fieldX === "" || chart.fieldX === "null") {

        /**
         * Gráficos quantitativos (PIZZA)
         */
        if (chart.fieldY.constructor === Array) {
            dadosTabela = privateChartGetDataMakerYMult(chart);

        } else if (typeof chart.fieldY === "string") {
            dadosTabela = privateChartGetDataMakerY(chart);
        }

    } else {

        /**
         * Gráficos comparativos X, Y (plano carteziano)
         */
        if (chart.fieldY.constructor === Array) {
            dadosTabela = privateChartGetDataMakerXYMult(chart);

        } else if (typeof chart.fieldY === "string") {
            dadosTabela = privateChartGetDataMakerXY(chart);
        }

        /**
         * Preeche dados ausente caso tenha data em X
         */
        if (chart.fieldDate) {
            if (chartFilter.interval === "week" || chartFilter.interval === "month") {
                $.each(getDates(chartFilter.dateStart, chartFilter.dateEnd), function (i, date) {
                    let dateNow = date.getFullYear() + "-" + zeroEsquerda(date.getMonth() + 1) + "-" + zeroEsquerda(date.getDate());
                    if (typeof dadosTabela[dateNow] === "undefined") {
                        if (chart.operacao === "sum" || chart.operacao === "media" || chart.operacao === "maioria")
                            dadosTabela[dateNow] = null;
                        else
                            dadosTabela[dateNow] = [];
                    }
                });
            } else if (chartFilter.interval === "year") {
                let year = chartFilter.dateStart.split("-")[0];
                for (let i = 1; i < 13; i++) {
                    let dateNow = year + "-" + zeroEsquerda(i) + "-15";
                    if (typeof dadosTabela[dateNow] === "undefined") {
                        if (chart.operacao === "sum" || chart.operacao === "media" || chart.operacao === "maioria")
                            dadosTabela[dateNow] = null;
                        else
                            dadosTabela[dateNow] = [];
                    }
                }
            }
        }

        /**
         * Convert array associativo para plano Cartesiano
         */
        let dataResult = [];
        let convertIndex = 1;
        let convertStringToNumber = [];
        let labelYString = [];
        let isStringYLabel = !1;
        let bigger = -999999;
        let smaller = 99999999999;

        for (let x in dadosTabela) {
            let y = chart.functionValueY(dadosTabela[x]);
            if (isEmpty(y)) {
                dataResult.push({x: chart.functionValueX(x), y: "", v: "", r: 0});
            } else {
                if (chart.operacao === "registros") {

                    /**
                     * Bubble Radius Calculate
                     */
                    let dd = [];
                    $.each(y, function (i, v) {
                        if (typeof dd[v] === "undefined")
                            dd[v] = 1;
                        else
                            dd[v]++;
                    });

                    for (let n in dd) {
                        if (isNaN(n)) {
                            isStringYLabel = !0;
                            if (typeof convertStringToNumber[n] === "undefined") {
                                if (chart.order) {
                                    if (chart.order.indexOf(n) > -1) {
                                        labelYString[chart.order.indexOf(n) + 1] = n;
                                        convertStringToNumber[n] = chart.order.indexOf(n) + 1;
                                    } else {
                                        continue;
                                    }
                                } else {
                                    labelYString[convertIndex] = n;
                                    convertStringToNumber[n] = convertIndex++;
                                }
                            }
                        }

                        //atualiza valores utilizados na conversão da proporção do radius
                        if (bigger < dd[n])
                            bigger = dd[n];
                        if (smaller > dd[n])
                            smaller = dd[n];

                        dataResult.push({
                            x: chart.functionValueX(x),
                            y: convertStringToNumber[n],
                            v: dd[n],
                            r: dd[n]
                        });
                    }
                } else {
                    dataResult.push({x: chart.functionValueX(x), y: y});
                }
            }
            chart.labels.push(chart.functionValueX(x));
        }

        /**
         * Convert Radius Proporção
         */
        let min = 6;
        let max = 10;
        $.each(dataResult, function (i, e) {
            if (dataResult[i].r > 0)
                dataResult[i].r = ((dataResult[i].r * (max - min)) / bigger) + min;
        });

        if (isStringYLabel) {
            chart.stepY = 1;
            chart.minY = 0;

            /**
             * Cria camada de personalização em Label Y
             */
            chart.functionAssocLabelY = y => {
                return labelYString[y];
            };

            /**
             * Cria camada de Tooltips personalizado
             */
            chart.functionTooltips = (x, y, v) => {
                return v + " registro" + (v > 1 ? "s" : "");
            };
        }

        dadosTabela = dataResult;
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

function privateChartGenerateBase($this, type) {
    type = typeof type !== "undefined" ? type : "bar";

    if (isEmpty($this.fieldY)) {
        toast("Gráfico Erro! Data ou campo Y ausente", 7000, "toast-warning");
        return "";
    }

    if (!$this.operacao)
        $this.operacao = "registros";

    if (!$this.functionLabelX) {
        $this.functionLabelX = x => {
            return x;
        };
    }

    if (!$this.functionLabelY) {
        $this.functionLabelY = y => {
            return y;
        };
    }

    if (!$this.functionAssocLabelY) {
        $this.functionAssocLabelY = y => {
            return y;
        };
    }

    if (!$this.functionValueX) {
        $this.functionValueX = x => {
            return x;
        };
    }

    if (!$this.functionValueY) {
        $this.functionValueY = y => {
            return y;
        };
    }

    $this.paddings = $this.paddings || {top: 30, right: 30, bottom: 30, left: 30};
    $this.functionTooltips = typeof $this.functionTooltips === "function" ? $this.functionTooltips : function (x, y, v) {
        return y;
    };
    $this.functionColor = typeof $this.functionColor === "function" ? $this.functionColor : function (c) {
        return c;
    };

    $this.type = operatorChartSetType(type);
    $this.labels = [];
    $this.backgroundColor = [];
    $this.data = privateChartGetDataMaker($this);

    if ($this.fieldDate && !$this.minX)
        $this.minX = chartFilter.dateStart;

    if ($this.fieldDate && !$this.maxX)
        $this.maxX = chartFilter.dateEnd;

    return $this;
}

function privateChartGenerateOptions($this) {
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

    options.idChart = Date.now() + Math.floor((Math.random() * 10000) + 1);
    options.funcitonImage = (typeof $this.functionImage === "function");

    if (["radar", "pie", "doughnut", "polarArea"].indexOf($this.type[0]) > -1) {

        //PIE
        options.aspectRatio = 3;
        options.tooltips.callbacks.label = function (tooltipItem, data) {
            var dataset = data.datasets[tooltipItem.datasetIndex];
            var meta = dataset._meta[Object.keys(dataset._meta)[0]];
            var total = meta.total;
            var currentValue = dataset.data[tooltipItem.index];
            var percentage = parseFloat((currentValue / total * 100).toFixed(1));
            return ' ' + percentage + '% (' + currentValue + ')';
        };

        options.plugins = {
            labels: [{
                render: 'percentage',
                position: 'outside',
                fontColor: '#555',
                textMargin: 7
            }]
        };

        for (let i in $this.labels)
            $this.labels[i] = $this.functionLabelY($this.functionAssocLabelY($this.labels[i]));

        options.legend = {position: "left", reverse: !0};
    } else {

        //BAR
        options.plugins = {
            labels: [{
                render: 'value',
            }]
        };

        if (chartFilter.interval === "day") {
            for (let i in $this.labels)
                $this.labels[i] = (parseInt(i) + 1) + "º";
        }

        $this.backgroundColor = function (context) {
            let value = $this.functionAssocLabelY(context.dataset.data[context.dataIndex].y);
            return $this.functionColor(value);
        };
        options.tooltips.callbacks = {
            title: function (tooltipItem, data) {
                return $this.title || data.labels[tooltipItem[0].index];
            },
            label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return ' ' + $this.functionTooltips(dataset.x, $this.functionAssocLabelY(dataset.y), dataset.v);
            }
        };

        options.legend = {
            display: !1
        };

        options.responsive = true;
        options.aspectRatio = 3;
        options.scales = {
            yAxes: [{
                gridLines: {
                    display: typeof $this.hideLineY === "undefined",
                    color: "#F5F5F5",
                    drawBorder: typeof $this.hideLineX === "undefined",
                    zeroLineWidth: 3,
                    zeroLineColor: "#EEEEEE"
                },
                ticks: {
                    padding: 15,
                    max: $this.maxY || undefined,
                    min: $this.minY || undefined,
                    beginAtZero: $this.minY == 0,
                    stepSize: $this.stepY || undefined,
                    callback: function (y) {
                        return $this.functionLabelY($this.functionAssocLabelY(y));
                    },
                    display: typeof $this.hideLabelY === "undefined"
                }
            }],
            xAxes: [{
                stacked: true,
                type: (chartFilter.interval === "day" ? undefined : 'time'),
                gridLines: {
                    display: typeof $this.hideLineX === "undefined",
                    color: "#F5F5F5",
                    drawBorder: typeof $this.hideLineY === "undefined",
                    zeroLineWidth: 3,
                    zeroLineColor: "#EEEEEE"
                },
                ticks: {
                    padding: 0,
                    max: $this.maxX || undefined,
                    min: $this.minX || undefined,
                    beginAtZero: $this.minX == 0,
                    source: 'data',
                    autoSkip: !1,
                    stepSize: $this.stepX || undefined,
                    callback: $this.functionLabelX,
                    display: typeof $this.hideLabelX === "undefined"
                },
                time: {
                    unit: chartFilter.interval,
                    displayFormats: {
                        'day': 'H',
                        'week': 'ddd',
                        'month': 'D',
                        'year': 'MMM'
                    },
                    unitStepSize: 1
                },
                offset: true
            }]
        }
    }

    return options;
}

function privateChartGenerateImages($this, idChart) {
    if (typeof $this.functionImage === "function") {
        let images = {};
        let isImage = new RegExp("^http", "i");

        /**
         * Constrói a lista com os objetos de imagens
         */
        $.each($this.data, function (i, data) {
            let src = $this.functionImage($this.functionAssocLabelY(data.y));
            if (isImage.test(src)) {
                let imageObj = new Image();
                imageObj.src = src;
                imageObj.width = data.r * 3;
                imageObj.height = data.r * 3;
                images[i] = imageObj;
            } else {
                images[i] = "";
            }
        });

        /**
         * Adiciona as imagens no gráfico
         */
        Chart.pluginService.register({
            afterUpdate: function (chart) {
                if (chart.options.idChart === idChart) {
                    $.each(chart.config.data.datasets[0].data, function (i, data) {
                        if (images[i] !== "") {
                            $.each(Object.keys(chart.config.data.datasets[0]._meta), function (ii, key) {
                                chart.config.data.datasets[0]._meta[key].data[i]._model.pointStyle = (chart.options.funcitonImage ? images[i] : "");
                            });
                        }
                    });
                }
            }
        });
    }
}

/*
class ChartMaker {
    data = [];
    title = "";
    type = ["bar"];
    fieldX = null;
    fieldY = null;
    fieldDate = null;
    operacao = "sum";
    labels = [];
    stepY = 1;
    stepX = 1;
    order = [];
    roundValueStepX = !1;
    roundValueStepY = !1;
    minX = 0;
    minY = 0;
    maxX = null;
    maxY = null;
    hideLineY = !1;
    hideLineX = !1;
    hideLabelY = !1;
    hideLabelX = !1;
    backgroundColor = null;
    functionValueX = null;
    functionValueY = null;
    functionLabelX = null;
    functionLabelY = null;
    functionAssocLabelY = null;
    functionTooltips = null;
    functionColor = null;
    borderWidth = 1;
    paddings = null;

    setTitle(title) {
        if (typeof title === "string")
            this.title = title;
    }

    setData(data) {
        if (typeof data !== "undefined" && data !== null && data.constructor === Array)
            this.data = data;
    }

    setType(type) {
        this.type = operatorChartSetType(type);
    }

    setOrder(order) {
        if (typeof order === "object" && order.constructor === Array)
            this.order = order;
    }

    setFieldX(x) {
        if (typeof x === "string")
            this.fieldX = x;
    }

    setFieldY(y) {
        if (typeof y === "string" || (typeof y !== "undefined" && y !== null && y.constructor === Array))
            this.fieldY = y;
    }

    setFieldDate(date) {
        let dateCheck = new RegExp("^\\d{4}-\\d{2}-\\d{2}(\\s\\d{2}:\\d{2}:\\d{2})*$", "i");
        if (dateCheck)
            this.fieldDate = date;
    }

    setLabels(l) {
        if (typeof l === "object" && l.constructor === Array)
            this.labels = l;
    }

    setOperacaoSoma() {
        this.operacao = "sum";
    }

    setOperacaoMedia() {
        this.operacao = "media";
    }

    setOperacaoMaioria() {
        this.operacao = "maioria";
    }

    setStepX(step) {
        if (!isNaN(step))
            this.stepX = step;
    }

    setStepY(step) {
        if (!isNaN(step))
            this.stepY = step;
    }

    setRoundValueStepX() {
        this.roundValueStepX = !0;
    }

    setRoundValueStepY() {
        this.roundValueStepY = !0;
    }

    setMinX(min) {
        if (!isNaN(min))
            this.minX = min;
    }

    setMaxX(max) {
        if (!isNaN(max))
            this.maxX = max;
    }

    setMinY(min) {
        if (!isNaN(min))
            this.minY = min;
    }

    setMaxY(max) {
        if (!isNaN(max))
            this.maxY = max;
    }

    setHideLineY() {
        this.hideLineY = !0;
    }

    setHideLineX() {
        this.hideLineX = !0;
    }

    setHideLabelY() {
        this.hideLabelY = !0;
    }

    setHideLabelX() {
        this.hideLabelX = !0;
    }

    setBoderWidth(b) {
        if (!isNaN(b))
            this.borderWidth = b;
    }

    setPaddings(p) {
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
    }

    setFunctionValueX(f) {
        if (typeof f === "function")
            this.functionValueX = f;
    }

    setFunctionValueY(f) {
        if (typeof f === "function")
            this.functionValueY = f;
    }

    setFunctionLabelX(f) {
        if (typeof f === "function")
            this.functionLabelX = f;
    }

    setFunctionLabelY(f) {
        if (typeof f === "function")
            this.functionLabelY = f;
    }

    setFunctionTooltips(f) {
        if (typeof f === "function")
            this.functionTooltips = f;
    }

    setFunctionColor(f) {
        if (typeof f === "function")
            this.functionColor = f;
    }

    setFunctionImage(f) {
        if (typeof f === "function")
            this.functionImage = f;
    }

    getData() {
        let $this = this;

        if (typeof $this.labels === "undefined" || isEmpty($this.labels))
            $this = privateChartGenerateBase($this);

        return $this.data;
    }

    getChart(type) {
        let $this = this;

        if (typeof $this.labels === "undefined" || isEmpty($this.labels))
            $this = privateChartGenerateBase($this, type);
        else if (typeof type !== "undefined")
            $this.type = operatorChartSetType(type);

        if (isEmpty($this.data)) {
            return $("<div class='col'><h3 class='padding-64 align-center font-bold font-xlarge color-text-gray'>Nenhum registro</h3></div>");
        } else {
            let options = privateChartGenerateOptions($this);

            privateChartGenerateImages($this, options.idChart);

            let $canvas = $("<canvas></canvas>");
            let ctx = $canvas[0].getContext('2d');

            let isImage = new RegExp("^http", "i");

            new Chart(ctx, {
                type: $this.type[0],
                data: {
                    labels: $this.labels,
                    datasets: [{
                        data: $this.data,
                        backgroundColor: $this.backgroundColor,
                        pointBorderWidth: 0,
                        pointBorderColor: "#FFFFFF",
                        pointRadius: function (chart) {
                            if (isEmpty(chart.dataset.data[chart.dataIndex].y) || chart.dataset.data[chart.dataIndex].y < chart.chart.options.scales.yAxes[0].ticks.min)
                                return 0;

                            return 10;
                        },
                        pointHoverRadius: function (chart) {
                            if (isEmpty(chart.dataset.data[chart.dataIndex].y) || chart.dataset.data[chart.dataIndex].y < chart.chart.options.scales.yAxes[0].ticks.min)
                                return 0;

                            return 11;
                        },
                        tension: 5,
                        borderWidth: 0
                    }]
                },
                options: options
            });

            return $canvas;
        }
    }
}*/
window.ChartMaker = function () {
    return {
        data: [],
        title: "",
        type: ["bar"],
        fieldX: null,
        fieldY: null,
        fieldDate: null,
        operacao: "sum",
        labels: [],
        stepY: 1,
        stepX: 1,
        order: [],
        roundValueStepX: !1,
        roundValueStepY: !1,
        minX: 0,
        minY: 0,
        maxX: null,
        maxY: null,
        hideLineY: !1,
        hideLineX: !1,
        hideLabelY: !1,
        hideLabelX: !1,
        backgroundColor: null,
        backgroundImage: null,
        functionValueX: null,
        functionValueY: null,
        functionLabelX: null,
        functionLabelY: null,
        functionAssocLabelY: null,
        functionTooltips: null,
        functionColor: null,
        borderWidth: 1,
        paddings: null,
        setTitle: title => {
            if (typeof title === "string")
                this.title = title;
        },
        setData: data => {
            if (typeof data !== "undefined" && data !== null && data.constructor === Array)
                this.data = data;
        },
        setType: type => {
            this.type = operatorChartSetType(type);
        },
        setOrder: order => {
            if (typeof order === "object" && order.constructor === Array)
                this.order = order;
        },
        setFieldX: x => {
            if (typeof x === "string")
                this.fieldX = x;
        },
        setFieldY: y => {
            if (typeof y === "string" || (typeof y !== "undefined" && y !== null && y.constructor === Array))
                this.fieldY = y;
        },
        setFieldDate: date => {
            let dateCheck = new RegExp("^\\d{4}-\\d{2}-\\d{2}(\\s\\d{2}:\\d{2}:\\d{2})*$", "i");
            if (dateCheck)
                this.fieldDate = date;
        },
        setLabels: l => {
            if (typeof l === "object" && l.constructor === Array)
                this.labels = l;
        },
        setOperacaoSoma: () => {
            this.operacao = "sum";
        },
        setOperacaoMedia: () => {
            this.operacao = "media";
        },
        setOperacaoMaioria: () => {
            this.operacao = "maioria";
        },
        setStepX: step => {
            if (!isNaN(step))
                this.stepX = step;
        },
        setStepY: step => {
            if (!isNaN(step))
                this.stepY = step;
        },
        setRoundValueStepX: () => {
            this.roundValueStepX = !0;
        },
        setRoundValueStepY: () => {
            this.roundValueStepY = !0;
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
        setHideLineY: () => {
            this.hideLineY = !0;
        },
        setHideLineX: () => {
            this.hideLineX = !0;
        },
        setHideLabelY: () => {
            this.hideLabelY = !0;
        },
        setHideLabelX: () => {
            this.hideLabelX = !0;
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
        setFunctionValueX: f => {
            if (typeof f === "function")
                this.functionValueX = f;
        },
        setFunctionValueY: f => {
            if (typeof f === "function")
                this.functionValueY = f;
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
        setFunctionImage: f => {
            if (typeof f === "function")
                this.functionImage = f;
        },
        getData: () => {
            let $this = this;

            if (typeof $this.labels === "undefined" || isEmpty($this.labels))
                $this = privateChartGenerateBase($this);

            return $this.data;
        },
        getChart: type => {
            let $this = this;

            if (typeof $this.labels === "undefined" || isEmpty($this.labels))
                $this = privateChartGenerateBase($this, type);
            else if (typeof type !== "undefined")
                $this.type = operatorChartSetType(type);

            if (isEmpty($this.data)) {
                return $("<div class='col'><h3 class='padding-64 align-center font-bold font-xlarge color-text-gray'>Nenhum registro</h3></div>");
            } else {
                let options = privateChartGenerateOptions($this);

                privateChartGenerateImages($this, options.idChart);

                let $canvas = $("<canvas></canvas>");
                let ctx = $canvas[0].getContext('2d');

                new Chart(ctx, {
                    type: $this.type[0],
                    data: {
                        labels: $this.labels,
                        datasets: [{
                            data: $this.data,
                            backgroundColor: $this.backgroundColor,
                            pointBorderWidth: 0,
                            pointBorderColor: "#FFFFFF",
                            pointRadius: function (chart) {
                                if (isEmpty(chart.dataset.data[chart.dataIndex].y) || chart.dataset.data[chart.dataIndex].y < chart.chart.options.scales.yAxes[0].ticks.min)
                                    return 0;

                                return 10;
                            },
                            pointHoverRadius: function (chart) {
                                if (isEmpty(chart.dataset.data[chart.dataIndex].y) || chart.dataset.data[chart.dataIndex].y < chart.chart.options.scales.yAxes[0].ticks.min)
                                    return 0;

                                return 11;
                            },
                            tension: 5,
                            borderWidth: 0
                        }]
                    },
                    options: options
                });

                return $canvas;
            }
        }
    };
};

var modChart = {};

function graficoSintomas(registros) {

    for (let i in registros) {
        let dh = registros[i]['created'].split(" ");
        registros[i].date = dh[0];
        registros[i].hour = dh[1];
    }

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("date");
    grafico.setFieldX("date");
    grafico.setFieldY("title");
    grafico.setHideLineX();
    grafico.setTitle("Sintomas mais Relevantes");
    grafico.setMinY(0);
    grafico.setFunctionColor(function (y) {
        return "#df5791";
    });

    console.log(grafico.getData());

    $content.append(grafico.getChart("scatter"));

    return $content;
}

function graficoMedicamentos(registros) {
    console.log(registros);
}

function graficoAtividade(registros) {

    for (let i in registros) {
        let dh = registros[i]['date_hour'].split(" ");
        registros[i].date = dh[0];
        registros[i].hour = dh[1];
    }

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("date");
    grafico.setFieldX("date");

    if (modChart['atividade-fisica'] === 1)
        grafico.setFieldY("kilo_burn");
    else if (modChart['atividade-fisica'] === 2)
        grafico.setFieldY("footsteps");
    else if (modChart['atividade-fisica'] === 3)
        grafico.setFieldY("runningKm");
    else if (modChart['atividade-fisica'] === 4)
        grafico.setFieldY("runningTime");
    else if (modChart['atividade-fisica'] === 5)
        grafico.setFieldY("steps");

    grafico.setHideLineX();
    grafico.setHideLabelY();
    grafico.setOperacaoSoma();
    grafico.setTitle(getTitleIndicador("atividade-fisica"));
    grafico.setMinY(0);
    grafico.setFunctionColor(function (y) {
        return "#c14973";
    });

    if (modChart['atividade-fisica'] > 1)
        $content.append(Mustache.render(tpl.graficoArrowBack, {
            indicador: 'atividade-fisica',
            mod: modChart['atividade-fisica'] - 1
        }));

    $content.append(grafico.getChart("bar"));

    if (modChart['atividade-fisica'] < 5)
        $content.append(Mustache.render(tpl.graficoArrowForward, {
            indicador: 'atividade-fisica',
            mod: modChart['atividade-fisica'] + 1
        }));

    return $content;
}

function graficoCrises(registros) {
    if (modChart['crises'] === 2)
        return graficoCrises2(registros);

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("created");
    grafico.setFieldX("created");
    grafico.setFieldY("seizure_intensity");
    grafico.setHideLineX();
    grafico.setHideLabelY();
    grafico.setOperacaoMedia();
    grafico.setStepY(5);
    grafico.setTitle("Crises");

    let funcaoLabelY = title => {
        if (isEmpty(title)) {
            return "";
        } else if (title === 0)
            return "Sem Crise";
        else if (title < 3)
            return "Fraca";
        else if (title < 6)
            return "Média";

        return 'Forte';
    };

    grafico.setFunctionTooltips(function (x, y) {
        if (y === 10)
            return "Forte";
        else if (y === 5)
            return "Média";

        return "Fraca";
    });

    grafico.setFunctionColor(function (y) {
        if (y < 3)
            return "#FF6D6D";
        else if (y < 6)
            return "#CD3B3B";

        return "#6F0000";
    });

    grafico.setFunctionLabelY(funcaoLabelY);
    grafico.setMaxY(10);
    grafico.setMinY(0);

    let listXComentarios = [];
    for (let i in registros) {
        if (typeof listXComentarios[registros[i].created] === "undefined")
            listXComentarios[registros[i].created] = "";

        if (!isEmpty(registros[i].comment))
            listXComentarios[registros[i].created] += registros[i].comment + "<br><br>";
    }

    let listX = [];
    let data = grafico.getData();
    data = chartDataOrder(data, "x").reverse();

    let xComments = [];
    for (let i in data) {
        let v = data[i].y;
        listX.push({
            img: "nivel" + (!isEmpty(v) ? (v === 0 ? "" : (v < 3 ? 1 : (v < 6 ? 2 : 3))) : 0),
            style: (isEmpty(v) ? "padding-top: 5px;" : ""),
            title: funcaoLabelY(v)
        });

        if (typeof listXComentarios[data[i].x] === "string")
            xComments.push(listXComentarios[data[i].x]);
        else
            xComments.push("");
    }

    $content.append(Mustache.render(tpl.graficoCrises, {home: HOME, vendor: VENDOR, x: listX}));

    /**
     * Função para determinar proporção das imagens da listX
     */
    setTimeout(function () {
        let intensidadeBlock = $content.find(".grafico-crises-intensidade");
        let xSpace = intensidadeBlock[0].clientWidth - parseInt(intensidadeBlock.css("padding-left")) - parseInt(intensidadeBlock.css("padding-right")) - 2;
        let widthList = xSpace / listX.length;
        let percentWidth = (widthList < 30 ? .8 : (widthList < 50 ? .76 : (widthList < 70 ? .66 : (widthList < 90 ? .5 : .4))));
        let percentMargin = (widthList < 30 ? .1 : (widthList < 50 ? .12 : (widthList < 70 ? .17 : (widthList < 90 ? .25 : .3))));
        $(".grafico-crises-intensidade").find("img").css({
            width: (widthList * percentWidth) + "px",
            margin: "0 " + (widthList * percentMargin) + "px"
        });
    }, 1);

    $content.append(Mustache.render(tpl.graficoArrowForward, {indicador: 'crises', mod: 2, style: "top: 170px;"}));

    // $content.append(grafico.getChart("bar"));
    $content.append(graficoCrisesPeriodo(registros));

    $content.append(Mustache.render(tpl.graficoCrisesComentarios, {home: HOME, vendor: VENDOR, x: xComments}));

    return $content;
}

function privateChartGetDataCrisesCalendar(registros, isPrevius) {
    isPrevius = typeof isPrevius !== "undefined" && isPrevius;
    let startDate = chartFilter.dateStart;
    let endDate = chartFilter.dateEnd;

    if (isPrevius) {
        if (chartFilter.interval === "day") {
            chartFilter.dateStart = moment(chartFilter.dateStart).subtract(1, "days").format('YYYY-MM-DD');
            chartFilter.dateEnd = moment(chartFilter.dateEnd).subtract(1, "days").format('YYYY-MM-DD');
        } else if (chartFilter.interval === "week") {
            chartFilter.dateStart = moment(chartFilter.dateStart).subtract(7, "days").format('YYYY-MM-DD');
            chartFilter.dateEnd = moment(chartFilter.dateEnd).subtract(7, "days").format('YYYY-MM-DD');
        } else if (chartFilter.interval === "month") {
            chartFilter.dateStart = moment(chartFilter.dateStart).subtract(1, 'months').format('YYYY-MM-DD');
            chartFilter.dateEnd = moment(chartFilter.dateEnd).subtract(1, 'months').format('YYYY-MM-DD');
        }
    }

    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("created");
    grafico.setFieldX("created");
    grafico.setFieldY("seizure_intensity");
    grafico.setOperacaoMedia();
    grafico.setStepY(5);
    grafico.setMaxY(10);
    grafico.setMinY(0);

    let funcaoTooltips = (x, y) => {
        if (isEmpty(y))
            return "";
        else if (y < 3)
            return "Fraca";
        else if (y < 6)
            return "Média";

        return "Forte";
    }

    let funcaoColor = y => {
        if (y < 3)
            return "#FF6D6D";
        else if (y < 6)
            return "#CD3B3B";

        return "#6F0000";
    }

    let listX = [];
    let data = grafico.getData();
    data = chartDataOrder(data, "x").reverse();

    if (chartFilter.interval === "week" || chartFilter.interval === "month") {
        let d = data[0].x.split("-");
        let firstDate = d[0] + "-" + parseInt(d[1]) + "-" + parseInt(d[2]);
        let week = parseInt(moment(firstDate).format("d"));
        for (let i = 0; i < week; i++) {
            listX.push({
                title: "",
                style: "",
                dia: ""
            });
        }

        for (let i in data) {
            let v = data[i].y;
            listX.push({
                title: funcaoTooltips("", v),
                style: (!isEmpty(v) ? "color: #FFF;background: " + funcaoColor(v) : ""),
                dia: parseInt(data[i].x.split("-")[2])
            });
        }

    } else if (chartFilter.interval === "day") {
        for (let i in data) {
            let v = data[i].y;
            listX.push({
                title: funcaoTooltips("", v),
                style: (!isEmpty(v) ? "color: #FFF;background: " + funcaoColor(v) : ""),
                dia: ""
            });
        }

    } else {
        for (let i in data) {
            let v = data[i].y;
            listX.push({
                title: funcaoTooltips("", v),
                style: (!isEmpty(v) ? "color: #FFF;background: " + funcaoColor(v) : ""),
                dia: !isEmpty(v) && !isNaN(v) ? "" : "-"
            });
        }
    }

    chartFilter.dateStart = startDate;
    chartFilter.dateEnd = endDate;

    return listX;
}

function privateChartGetLabelCalendar(isPrevius) {
    let date = chartFilter.dateStart;

    if (typeof isPrevius !== "undefined" && isPrevius) {
        if (chartFilter.interval === "day") {
            date = moment(chartFilter.dateStart).subtract(1, "days").format('YYYY-MM-DD');
        } else if (chartFilter.interval === "week") {
            date = moment(chartFilter.dateStart).subtract(7, "days").format('YYYY-MM-DD');
        } else if (chartFilter.interval === "month") {
            date = moment(chartFilter.dateStart).subtract(1, 'months').format('YYYY-MM-DD');
        }
    }

    if (chartFilter.interval === "day") {
        return "dia " + moment(date).format("DD");
    } else if (chartFilter.interval === "week") {
        return Math.ceil(moment(date).date() / 7) + "ª semana de " + moment(date).format("MMMM");
    } else if (chartFilter.interval === "month") {
        return moment(date).format("MMMM");
    }

    return moment(date).format("YYYY");
}

function graficoCrises2(registros) {
    let $content = $("<div></div>");

    if (chartFilter.interval === "year") {
        $content.append(Mustache.render(tpl.chartCalendarYearBubble, {
            x: privateChartGetDataCrisesCalendar(registros),
            label: privateChartGetLabelCalendar()
        }))

    } else {
        let template = chartFilter.interval !== "day" ? tpl.chartCalendarBubble : tpl.chartCalendarDayBubble;
        let calendar2 = Mustache.render(template, {
            x: privateChartGetDataCrisesCalendar(registros),
            label: privateChartGetLabelCalendar()
        });
        let calendar1 = Mustache.render(template, {
            x: privateChartGetDataCrisesCalendar(registros, 1),
            label: privateChartGetLabelCalendar(1)
        });

        $content.append(Mustache.render(tpl.graficoCrisesCalendar, {
            home: HOME,
            vendor: VENDOR,
            calendar1: calendar1,
            calendar2: calendar2
        }))
    }

    $content.append(Mustache.render(tpl.graficoArrowBack, {indicador: 'crises', mod: 1, style: "top: 170px;"}));

    return $content;
}

function graficoCrisesPeriodo(registros) {

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("created");
    grafico.setFieldX("created");
    grafico.setFieldY("seizure_period");
    grafico.setHideLineX();
    grafico.setTitle("Período das Crises");
    grafico.setOrder(["night", "evening", "morning"]);
    grafico.setFunctionLabelY(function (y) {
        switch (y) {
            case 'morning':
                return "Manhã";
            case 'evening':
                return "Tarde";
            case 'night':
                return "Noite";
            default:
                return "";
        }
    });

    grafico.setFunctionImage(function (y) {
        switch (y) {
            case 'morning':
                return HOME + VENDOR + "site-pstmc/public/assets/img/graficos/crises/sun.png";
            case 'evening':
                return HOME + VENDOR + "site-pstmc/public/assets/img/graficos/crises/montain.png";
            case 'night':
                return HOME + VENDOR + "site-pstmc/public/assets/img/graficos/crises/moon.png";
            default:
                return "";
        }
    });

    grafico.setFunctionColor(function (y) {
        switch (y) {
            case 'morning':
                return "#ECC31E";
            case 'evening':
                return "#7EA9C7";
            case 'night':
                return "#7E87C8";
            default:
                return "#999999";
        }

    })

    // $content.append(Mustache.render(tpl.graficoArrowForward, {indicador: 'crises', mod: 2}));

    $content.append(grafico.getChart("bubble"));

    return $content;
}

function graficoSono(registros) {

    /**
     * Remove Registros que sejam menor que 5
     */
    for (let i = registros.length - 1; i > -1; i--) {
        if (registros[i].quality < 5)
            registros.splice(i, 1);
    }

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("date");
    grafico.setFieldX("date");
    grafico.setHideLineX();
    grafico.setOperacaoMedia();
    grafico.setStepY(2.5);

    if (modChart['sono'] === 1) {

        grafico.setFunctionColor(function (color) {
            if (color < 0)
                return "#BF0811";

            return '#2D92CB';
        });

        grafico.setFunctionLabelY(function (title) {
            if (title < 0)
                return "Ruim";
            else if (title > 0)
                return 'Bom';
            return "";
        });

        grafico.setFunctionTooltips(function (x, y) {
            if (y < 0)
                return "Ruim";
            else if (y > 0)
                return 'Bom';
            return "";
        })

        grafico.setFunctionValueY(function (y) {
            if (y === 0 || isEmpty(y))
                return null;

            return y - 7.5;
        });

        grafico.setMaxY(2.5);
        grafico.setMinY(-2.5);
        grafico.setFieldY("quality");
        grafico.setTitle("Qualidade do Sono");
        $content.append(Mustache.render(tpl.graficoArrowForward, {indicador: 'sono', mod: 2}));
    } else {

        grafico.setFunctionColor(function (color) {
            if (color < 6)
                return "#BF0811";
            else if (color > 7)
                return '#2D92CB';

            return '#606060';
        });

        grafico.setFunctionLabelY(function (y) {
            return y + " hr";
        });

        grafico.setFunctionTooltips(function (x, y) {
            return Math.floor(y) + ":" + Math.round(y % 1 * 60) + " hr";
        });

        grafico.setMinY(0);
        grafico.setFieldY("duration");
        grafico.setTitle("Horas de Sono");
        $content.append(Mustache.render(tpl.graficoArrowBack, {indicador: 'sono', mod: 1}));
    }

    $content.append(grafico.getChart("bar"));

    return $content;
}

function graficoHumor(registros) {
    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("date");
    grafico.setFieldY("mood_type");
    grafico.setMinY(0);
    grafico.setMaxY(5);
    grafico.setStepY(1);
    grafico.setRoundValueStepY();
    grafico.setHideLineX();
    grafico.setHideLabelY();
    grafico.setOperacaoMedia();
    grafico.setTitle("Humor");

    grafico.setFunctionTooltips(function (x, y) {
        y = typeof y === "undefined" && typeof x !== "undefined" ? x : y;
        // 1=feliz , 2=Bem, 3=Neutro, 4=Triste, 5=Irritado
        if (y < 1)
            return "Irritado";
        else if (y < 2)
            return 'Triste';
        else if (y < 3)
            return 'Neutro';
        else if (y < 4)
            return 'Bem';

        return 'Feliz';
    });

    grafico.setFunctionLabelY(function (y) {
        if (y < 1)
            return "Irritado";
        else if (y < 2)
            return 'Triste';
        else if (y < 3)
            return 'Neutro';
        else if (y < 4)
            return 'Bem';

        return 'Feliz';
    });

    grafico.setFunctionColor(function (color) {
        if (color < 1)
            return '#FF5159';
        else if (color < 2)
            return "#6849B7";
        else if (color < 3)
            return '#606060';
        else if (color < 4)
            return '#2D92CB';

        return '#7EC8BD';
    });

    grafico.setFunctionValueY(function (y) {
        switch (y) {
            case 1:
                return 4.5;
            case 2:
                return 3.5;
            case 3:
                return 2.5;
            case 4:
                return 1.5;
            case 5:
                return .5;
            default:
                return null;
        }
    });

    if (modChart['humor'] === 1) {

        /* SCATTER */
        $content.append(Mustache.render(tpl.graficoHumor, {}));
        grafico.setFieldX("date");
        grafico.setPaddings({left: 40, right: 20, bottom: 10, top: 20});

        $content.append(grafico.getChart("scatter"));
    } else {

        /* PIE */
        $content.append(Mustache.render(tpl.graficoHumor2, {}));
        $content.append(grafico.getChart("pie"));
    }

    return $content;
}

function grafico(indicador, registros, mod) {
    if (typeof mod === "undefined" && typeof modChart[indicador] === "undefined")
        modChart[indicador] = 1;
    else if (typeof mod !== "undefined")
        modChart[indicador] = mod;

    switch (indicador) {
        case 'humor':
            return graficoHumor(registros);
            break;
        case 'sono':
            return graficoSono(registros);
            break;
        case 'crises':
            return graficoCrises(registros);
            break;
        case 'atividade-fisica':
            return graficoAtividade(registros);
            break;
        case 'medicamentos':
            return graficoMedicamentos(registros);
            break;
        case 'sintomas':
            return graficoSintomas(registros);
            break;
    }
}

function graficoHeader(indicador) {
    let startDate = {day: '', month: '', year: ''};
    let endDate = {day: '', month: '', year: ''};
    let content = "";
    if (haveDate = chartFilter.dateStart && chartFilter.dateEnd) {
        startDate = chartFilter.dateStart.split("-");
        startDate = {day: startDate[2], month: startDate[1], year: startDate[0]};
        endDate = chartFilter.dateEnd.split("-");
        endDate = {day: endDate[2], month: endDate[1], year: endDate[0]};
    }

    if (indicador === "crises") {
        content = "<div class='left padding-small'>Fraca</div><img src='" + HOME + VENDOR + "site-pstmc/public/assets/img/graficos/nivel1.png' class='left padding-right' style='width:45px' />";
        content += "<div class='left padding-small'>Média</div><img src='" + HOME + VENDOR + "site-pstmc/public/assets/img/graficos/nivel2.png' class='left padding-right' style='width:45px' />";
        content += "<div class='left padding-small'>Forte</div><img src='" + HOME + VENDOR + "site-pstmc/public/assets/img/graficos/nivel3.png' class='left padding-right' style='width:45px' />";
    }

    return Mustache.render(tpl.graficoHeader, {
        title: getTitleIndicador(indicador),
        indicador: indicador,
        indicadorTitle: indicador.replace("-", " ").replace("_", " "),
        startDate: startDate,
        endDate: endDate,
        haveDate: haveDate,
        content: content
    });
}

function getTitleIndicador(indicador) {
    if (indicador === "atividade-fisica") {
        if (typeof modChart[indicador] === "undefined" || modChart[indicador] === 1)
            return "Calorias";
        else if (modChart[indicador] === 2)
            return "Degraus";
        else if (modChart[indicador] === 3)
            return "Kilometros";
        else if (modChart[indicador] === 4)
            return "Minutos";
        else if (modChart[indicador] === 5)
            return "Passos";
    }

    return indicador.replace("-", " ").replace("_", " ");
}

var readIndicador = {};

function graficos(ind) {
    return Promise.all([all]).then(() => {
        if (isEmpty(chartFilter.indicadores)) {
            $("#graficos").html(Mustache.render(tpl.pacienteGraficoEmpty, {HOME: HOME, VENDOR: VENDOR}));

        } else {

            if (typeof ind === "undefined")
                $("#graficos").html("");

            $.each(chartFilter.indicadores, function (ii, indicador) {
                if (!isEmpty(paciente) && (typeof ind === "undefined" || ind === indicador)) {
                    let $graficos = $("<div class='col relative grafico-box' id='graficos-" + indicador + "'></div>").appendTo("#graficos");
                    $graficos.prepend(graficoHeader(indicador));
                    let minHeight = (window.innerWidth > 1300 ? 243 : (window.innerWidth > 1100 ? 217 : 150));
                    let $grafico = $("<div class='col relative' style='min-width: 800px; min-height: " + minHeight + "px' id='grafico-" + indicador + "'></div>").appendTo($graficos);
                    $graficos.append("</div>");
                    $("<div class='col padding-24'></div>").appendTo("#graficos");

                    dbLocal.exeRead(indicador).then(g => {
                        if (isEmpty(g) || typeof readIndicador[indicador] === "undefined") {
                            readIndicador[indicador] = 1;
                            post("site-pstmc", "read-" + indicador, {
                                paciente: paciente
                            }, function (t) {
                                if (t) {
                                    $.each(t, function (i, e) {
                                        if (typeof e['id'] === "undefined")
                                            e['id'] = i;

                                        if (indicador === "sono") {
                                            if (isEmpty(e.duration) && !isEmpty(e.start_time) && !isEmpty(e.end_time)) {
                                                let ss = e.start_time.split(":");
                                                let ee = e.end_time.split(":");
                                                let dayStart = moment(e.date + " " + e.start_time);
                                                let dayEnd = (parseInt(ss[0]) < parseInt(ee[0]) ? dayStart : moment(moment(e.date).add(1, 'day').format("YYYY-MM-DD") + " " + e.end_time));
                                                let duration = moment.duration(dayEnd.diff(dayStart));
                                                e.duration = duration.asHours();
                                            }
                                        }
                                        dbLocal.exeCreate(indicador, e);
                                    });
                                    if (isEmpty(g))
                                        $grafico.html(grafico(indicador, t));
                                }
                            });
                        }

                        if (!isEmpty(g))
                            $grafico.html(grafico(indicador, g));
                    });
                }
            });
        }
    });
}

/**
 * Limite - atualiza valor da data de início com base no intervalo selecionado
 */
function privateChartDateUpdateLimit(useStartDateInsteadDateEnd, ignoraControleManual) {
    useStartDateInsteadDateEnd = typeof useStartDateInsteadDateEnd !== "undefined";
    ignoraControleManual = typeof ignoraControleManual !== "undefined";
    let now = new Date(ignoraControleManual ? Date.now() : (useStartDateInsteadDateEnd ? chartFilter.dateStart : chartFilter.dateEnd) + " 23:59:59");
    let limit = 0;

    if (chartFilter.interval === "year") {
        var timestmp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
        var yearFirstDay = Math.floor(timestmp / 86400000);
        var today = Math.ceil((now.getTime()) / 86400000);
        limit = today - yearFirstDay - 1;
    } else if (chartFilter.interval === "month") {
        limit = now.getDate() - 1;
    } else if (chartFilter.interval === "week") {
        limit = now.getDay();
    }

    if (useStartDateInsteadDateEnd) {
        limit = (chartFilter.interval === "year" ? 365 : (chartFilter.interval === "month" ? privateChartGetNumberDaysMonth(now.getMonth()) - 1 : (chartFilter.interval === "week" ? 6 : 1))) - limit;
        let dateLimit = new Date(now.setDate(now.getDate() + limit));
        dateLimit = dateLimit.getFullYear() + "-" + zeroEsquerda(dateLimit.getMonth() + 1) + "-" + zeroEsquerda(dateLimit.getDate());

        if (chartFilter.dateEnd > dateLimit || chartFilter.dateEnd < chartFilter.dateStart) {
            chartFilter.dateEnd = dateLimit;
            $("#date-end").val(chartFilter.dateEnd);
        }
    } else {
        let dateLimit = new Date(now.setDate(now.getDate() - limit));
        dateLimit = dateLimit.getFullYear() + "-" + zeroEsquerda(dateLimit.getMonth() + 1) + "-" + zeroEsquerda(dateLimit.getDate());
        if (ignoraControleManual || chartFilter.dateStart < dateLimit || chartFilter.dateStart > chartFilter.dateEnd) {
            chartFilter.dateStart = dateLimit;
            $("#date-start").val(chartFilter.dateStart);
        }

        if (ignoraControleManual) {
            limit = (chartFilter.interval === "year" ? 364 : (chartFilter.interval === "month" ? privateChartGetNumberDaysMonth(now.getMonth()) - 1 : (chartFilter.interval === "week" ? 6 : 0)));
            chartFilter.dateEnd = moment(chartFilter.dateStart).add(limit, 'days').format("YYYY-MM-DD");
            $("#date-end").val(chartFilter.dateEnd);
        }
    }
}

function privateChartGetDataFilter(data, indicador, mod) {
    if (indicador === "sono") {
        if (mod === 2) {
            $.each(data, function (i, e) {
                if (!isEmpty(e.start_time) && !isEmpty(e.end_time)) {
                    let ss = e.start_time.split(":");
                    let ee = e.end_time.split(":");
                    let dayStart = moment(e.date + " " + e.start_time);
                    let dayEnd = (parseInt(ss[0]) < parseInt(ee[0]) ? dayStart : moment(moment(e.date).add(1, 'day').format("YYYY-MM-DD") + " " + e.end_time));
                    let duration = moment.duration(dayEnd.diff(dayStart));
                    data[i].duration = duration.asHours();
                }
            });
        }
    }

    return data;
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
        chartFilter.dateStart = $(this).val();
        privateChartDateUpdateLimit(1);
        graficos();
    });
    $("#date-end").off("change").on("change", function () {
        chartFilter.dateEnd = $(this).val();
        privateChartDateUpdateLimit();
        graficos();
    });
    $(".time-week").off("click").on("click", function () {
        $(".time-week").removeClass("active");
        $(this).addClass("active");

        /**
         * Intervalo - atualiza valor
         */
        chartFilter.interval = $(this).attr("rel");
        privateChartDateUpdateLimit(undefined, 1);
        graficos();
    });
    $(".indicador").off("click").on("click", function () {

        if (chartFilter.indicadores.length === 0)
            $("#graficos").html("");

        let v = $(this).attr("rel");
        if (chartFilter.indicadores.indexOf(v) > -1) {
            removeItemArray(chartFilter.indicadores, v);
            $(this).removeClass("active");
            $("#graficos-" + v).remove();

            if (chartFilter.indicadores.length === 0)
                $("#graficos").html(Mustache.render(tpl.pacienteGraficoEmpty, {HOME: HOME, VENDOR: VENDOR}));
        } else {
            /*if (chartFilter.indicadores.length > 1) {
                let id = chartFilter.indicadores[0];
                $("#graficos-" + chartFilter.indicadores[0]).remove();
                chartFilter.indicadores.splice(0, 1);
                $(".indicador[rel='" + id + "']").removeClass("active")
            }*/
            chartFilter.indicadores.push(v);
            $(this).addClass("active");
            graficos(v);
        }
    });

    $("#app").off("click", ".graficoArrow").on("click", ".graficoArrow", function () {
        let indicador = $(this).attr("rel");
        let mod = parseInt($(this).attr("data-mod"));
        let $g = $("#grafico-" + indicador);
        $g.css({"height": $g[0].clientHeight + "px"});
        dbLocal.exeRead(indicador).then(g => {
            $g.html(grafico(indicador, g, mod));
            $("#grafico-header-title-" + indicador).html(getTitleIndicador(indicador));
            setTimeout(function () {
                $g.css({"height": "auto"});
            }, 200);
        });
    }).off("click", ".comment-crise").on("click", ".comment-crise", function () {
        let $comment = $("<div id='comment-crise'></div>").appendTo("#core-content");
        let $content = $("<div id='comment-crise-box' class='col animate-top'>" + $(this).attr("rel") + "</div>").appendTo($comment);
        setTimeout(function () {
            $comment.css("opacity", 1);
        }, 1);
    }).off("click", "#comment-crise").on("click", "#comment-crise", function () {
        $("#comment-crise-box").addClass("transition-easy").css("margin-top", 0).css("opacity", 0);
        $("#comment-crise").addClass("transition-easy").css("opacity", 0);
        setTimeout(function () {
            $("#comment-crise").remove();
        }, 200);
    });

    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + (month) + "-" + (day);

    let old = new Date(new Date().setDate(new Date().getDate() - 30));
    let Oldday = ("0" + old.getDate()).slice(-2);
    let Oldmonth = ("0" + (old.getMonth() + 1)).slice(-2);
    let lastMonth = old.getFullYear() + "-" + (Oldmonth) + "-" + (Oldday);

    // $("#date-start").val(lastMonth).trigger("change");
    // $("#date-end").val(today).trigger("change");

    //seta manualmente a data para testes
    $("#date-start").val("2019-10-01").trigger("change");
    $("#date-end").val("2019-10-31").trigger("change");

    graficos();

    getTemplates().then(tpl => {
        $(".paciente").append(Mustache.render(tpl.ajustes, {home: HOME}));
    });

    /*jQuery(document).bind('DOMMouseScroll mousewheel', function(e, delta) {
        if($(e.target).hasClass("chartjs-render-monitor")) {
            if(e.originalEvent.wheelDelta /120 > 0) {
            } else{
            }
        }

    });*/

})