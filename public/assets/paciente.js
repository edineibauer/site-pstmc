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
                dadosTabela[x].push(y);
            }
        }
    });

    for (let x in dadosTabela) {
        if (x !== "pushTo" && x !== "removeItem") {

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
                    if (y === "removeItem" || y === "pushTo")
                        continue;

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
    for (let x in dd) {
        if (x !== "pushTo" && x !== "removeItem") {
            ddd.push({x: x, y: dd[x]});
        }
    }
    ddd = chartDataOrder(ddd, "x").reverse();

    /**
     * Exportação dos dados
     */
    for (let x in ddd) {
        if (x !== "pushTo" && x !== "removeItem") {
            chart.labels.push(ddd[x].x);
            chart.backgroundColor.push(chart.functionColor(ddd[x].x));
            dadosTabela.push(ddd[x].y);
        }
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

function chartGetDataMaker(chart) {
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
         * Convert array associativo para plano Cartesiano
         */
        let dataResult = [];
        for (let x in dadosTabela) {
            if (x !== "pushTo" && x !== "removeItem") {
                let y = chart.functionValueY(dadosTabela[x]);
                dataResult.push({x: chart.functionValueX(x), y: y});
                chart.labels.push(chart.functionValueX(x));
            }
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
                if (x === "removeItem" || x === "pushTo")
                    continue;

                if (typeof data[x] === "object") {
                    for (let i in data[x]) {
                        if (i === "removeItem" || i === "pushTo")
                            continue;

                        if (!isNaN(data[x][i])) {
                            labels.push(funcaoX(x));

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
                if (i === "removeItem" || i === "pushTo")
                    continue;

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
                if (x === "removeItem" || x === "pushTo")
                    continue;

                if (typeof data[x] === "object") {
                    for (let i in data[x]) {
                        if (i === "removeItem" || i === "pushTo")
                            continue;

                        if (!isNaN(data[x][i])) {
                            labels.push(funcaoX(x));

                            if (type === "bubble") {
                                dd.push({x: funcaoX(x), y: funcaoY(data[x][i]), r: data[x][i]});

                                if (bigger < data[x][i])
                                    bigger = data[x][i];
                                if (smaller > data[x][i])
                                    smaller = data[x][i];

                            } else {
                                dd.push({x: funcaoX(x), y: funcaoY(data[x][i])});
                            }
                        }
                    }
                } else {
                    labels.push(funcaoX(x));

                    if (type === "bubble") {
                        dd.push({x: funcaoX(x), y: funcaoY(data[x]), r: data[x]});

                        if (bigger < data[x])
                            bigger = data[x];
                        if (smaller > data[x])
                            smaller = data[x];
                    } else {
                        dd.push({x: funcaoX(x), y: funcaoY(data[x])});
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
            if (x === "removeItem" || x === "pushTo")
                continue;

            if (!isNaN(data[x])) {
                labels.push(funcaoX(x));
                dd.push(data[x]);
            }
        }
        data = dd;

        type = (["radar", "pie", "doughnut", "polarArea"].indexOf(type[0]) > -1 ? type[0] : "pie");
    }

    return [type, data, labels];
}

function privateChartGenerateBase($this, type) {
    type = typeof type !== "undefined" ? type : "bar";
    if (isEmpty($this.data) || isEmpty($this.fieldY)) {
        toast("Gráfico Erro! Data ou campo Y ausente", 7000, "toast-warning");
        return "";
    }

    if (!$this.operacao)
        $this.operacao = "sum";

    if (!$this.functionLabelX) {
        $this.functionLabelX = (x) => {
            return x;
        };
    }

    if (!$this.functionLabelY) {
        $this.functionLabelY = (y) => {
            return y;
        };
    }

    if (!$this.functionValueX) {
        $this.functionValueX = (x) => {
            return x;
        };
    }

    if (!$this.functionValueY) {
        $this.functionValueY = (y) => {
            return y;
        };
    }

    $this.paddings = $this.paddings || {top: 30, right: 30, bottom: 30, left: 30};
    $this.functionTooltips = typeof $this.functionTooltips === "function" ? $this.functionTooltips : function (x, y) {
        return y;
    };
    $this.functionColor = typeof $this.functionColor === "function" ? $this.functionColor : function (c) {
        return c;
    };

    $this.type = operatorChartSetType(type);
    $this.labels = [];
    $this.backgroundColor = [];
    $this.data = chartGetDataMaker($this);

    console.log($this.data);

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

        console.log(Object.assign({}, $this.labels));
        for (let i in $this.labels) {
            if (i !== "pushTo" && i !== "removeItem")
                $this.labels[i] = $this.functionLabelY($this.labels[i]);
        }
        console.log(Object.assign({}, $this.labels));

        options.legend = {position: "left", reverse: !0};
    } else {

        if (chartFilter.interval === "day") {
            for (let i in $this.labels) {
                if (i !== "pushTo" && i !== "removeItem")
                    $this.labels[i] = (parseInt(i) + 1) + "º";
            }
        }

        //BAR
        $this.backgroundColor = function (context) {
            let value = context.dataset.data[context.dataIndex].y;
            return $this.functionColor(value);
        };
        options.tooltips.callbacks = {
            title: function (tooltipItem, data) {
                return $this.title || data.labels[tooltipItem[0].index];
            },
            label: function (tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                return ' ' + $this.functionTooltips(dataset.x, dataset.y);
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
                    callback: $this.functionLabelY,
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
        functionValueX: null,
        functionValueY: null,
        functionLabelX: null,
        functionLabelY: null,
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
        getData: () => {
            let $this = privateChartGenerateBase(this);
            return $this.data;
        },
        getChart: type => {
            let $this = this

            $this = privateChartGenerateBase($this, type);
            let options = privateChartGenerateOptions($this);

            let $canvas = $("<canvas></canvas>");
            let ctx = $canvas[0].getContext('2d');

            new Chart(ctx, {
                type: $this.type[0],
                data: {
                    labels: $this.labels,
                    datasets: [{
                        data: $this.data,
                        backgroundColor: $this.backgroundColor,
                        pointRadius: 10,
                        pointHoverRadius: 11,
                        borderWidth: 0
                    }]
                },
                options: options
            });

            return $canvas;
        }
    };
};

var modChart = {};

function graficoCrises(registros) {

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("created");
    grafico.setFieldX("created");
    grafico.setFieldY("seizure_intensity");
    grafico.setHideLineX();
    grafico.setOperacaoMedia();
    grafico.setStepY(5);
    grafico.setTitle("Crises");

    let funcaoLabelY = title => {
        if (title === 10)
            return "Forte";
        else if (title === 5)
            return "Média";
        else if (title === 0)
            return "Fraca";

        return 'traço';
    };

    grafico.setFunctionTooltips(function (x, y) {
        if (y === 10)
            return "Forte";
        else if (y === 5)
            return "Média";

        return "Fraca";
    });

    grafico.setFunctionColor(function (y) {
        if (y === 10)
            return "#6F0000";
        else if (y === 5)
            return "#CD3B3B";

        return "#FF6D6D";
    })


    grafico.setFunctionLabelY(funcaoLabelY);
    grafico.setMaxY(10);
    grafico.setMinY(0);

    /*let listX = [];
    let data = grafico.getData();

    for (let i in data) {
        if(i !== "pushTo" && i !== "removeItem") {
            let v = data[i].y;
            listX.push({
                img: "nivel" + (v === 10 ? 3 : (v === 5 ? 2: (v === 0 ? 1 : 0))),
                title: funcaoLabelY(v)
            });
        }
    }

    $content.append(Mustache.render(tpl.graficoCrises, {home: HOME, vendor: VENDOR, x: listX}));

    $content.append(Mustache.render(tpl.graficoArrowForward, {indicador: 'crises', mod: 2}));*/

    $content.append(grafico.getChart("bar"));

    return $content;
}

function graficoSono(registros) {

    let $content = $("<div></div>");
    let grafico = new ChartMaker();
    grafico.setData(registros);
    grafico.setFieldDate("date");
    grafico.setFieldX("date");
    grafico.setHideLineX();
    grafico.setOperacaoMedia();
    grafico.setStepY(5);

    if (modChart['sono'] === 1) {

        grafico.setFunctionColor(function (color) {
            if (color < 0)
                return "#BF0811";

            return '#2D92CB';
        });

        grafico.setFunctionLabelY(function (title) {
            if (title < 0)
                return "Ruim";

            return 'Bom';
        });

        grafico.setFunctionTooltips(function (x, y) {
            if (y < 0)
                return "Ruim";

            return 'Bom';
        })

        grafico.setFunctionValueY(function (y) {
            return y - 5;
        });

        grafico.setMaxY(5);
        grafico.setMinY(-5);
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
    })

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
            default:
                return .5;
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
        indicador: indicador,
        startDate: startDate,
        endDate: endDate,
        haveDate: haveDate,
        content: content
    });
}

function graficos(ind) {
    return Promise.all([all]).then(() => {
        if (isEmpty(chartFilter.indicadores)) {
            $("#graficos").html(Mustache.render(tpl.pacienteGraficoEmpty, {HOME: HOME, VENDOR: VENDOR}));

        } else {

            if (typeof ind === "undefined")
                $("#graficos").html("");

            $.each(chartFilter.indicadores, function (ii, indicador) {
                if (!isEmpty(paciente) && (typeof ind === "undefined" || ind === indicador)) {
                    let $graficos = $("<div class='col relative' id='graficos-" + indicador + "'></div>").appendTo("#graficos");
                    $graficos.prepend(graficoHeader(indicador));
                    let minHeight = (window.innerWidth > 1300 ? 243 : (window.innerWidth > 1100 ? 217 : 150));
                    let $grafico = $("<div class='col relative' style='min-height: " + minHeight + "px' id='grafico-" + indicador + "'></div>").appendTo($graficos);
                    $graficos.append("<div class='col padding-8'></div></div>");

                    dbLocal.exeRead(indicador).then(g => {
                        post("site-pstmc", "read-" + indicador, {
                            paciente: paciente
                        }, function (t) {
                            if (t) {
                                $.each(t, function (i, e) {
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

                        if (!isEmpty(g))
                            $grafico.html(grafico(indicador, g));
                    });
                }
            });
        }
    });
}

function privateChartGetNumberDaysMonth(month) {
    if (month === 1)
        return 28;

    if ([3, 5, 8, 10].indexOf(month) > -1)
        return 30;

    return 31;
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
            chartFilter.indicadores.removeItem(v);
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
            setTimeout(function () {
                $g.css({"height": "auto"});
            }, 200);
        });
    });

    let now = new Date();
    let day = ("0" + now.getDate()).slice(-2);
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let today = now.getFullYear() + "-" + (month) + "-" + (day);

    let old = new Date(new Date().setDate(new Date().getDate() - 30));
    let Oldday = ("0" + old.getDate()).slice(-2);
    let Oldmonth = ("0" + (old.getMonth() + 1)).slice(-2);
    let lastMonth = old.getFullYear() + "-" + (Oldmonth) + "-" + (Oldday);

    $("#date-start").val(lastMonth).trigger("change");
    $("#date-end").val(today).trigger("change");
    graficos();

    /*jQuery(document).bind('DOMMouseScroll mousewheel', function(e, delta) {
        if($(e.target).hasClass("chartjs-render-monitor")) {
            if(e.originalEvent.wheelDelta /120 > 0) {
            } else{
            }
        }

    });*/

})