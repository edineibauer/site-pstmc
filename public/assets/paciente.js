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

Chart.elements.Rectangle.prototype.draw=function(){function t(t){return s[(f+t)%4]}var r,e,i,o,_,h,l,a,b=this._chart.ctx,d=this._view,n=d.borderWidth,u=this._chart.config.options.cornerRadius;if(u<0&&(u=0),void 0===u&&(u=0),d.horizontal?(r=d.base,e=d.x,i=d.y-d.height/2,o=d.y+d.height/2,_=e>r?1:-1,h=1,l=d.borderSkipped||"left"):(r=d.x-d.width/2,e=d.x+d.width/2,i=d.y,_=1,h=(o=d.base)>i?1:-1,l=d.borderSkipped||"bottom"),n){var T=Math.min(Math.abs(r-e),Math.abs(i-o)),v=(n=n>T?T:n)/2,g=r+("left"!==l?v*_:0),c=e+("right"!==l?-v*_:0),C=i+("top"!==l?v*h:0),w=o+("bottom"!==l?-v*h:0);g!==c&&(i=C,o=w),C!==w&&(r=g,e=c)}b.beginPath(),b.fillStyle=d.backgroundColor,b.strokeStyle=d.borderColor,b.lineWidth=n;var s=[[r,o],[r,i],[e,i],[e,o]],f=["bottom","left","top","right"].indexOf(l,0);-1===f&&(f=0);var q=t(0);b.moveTo(q[0],q[1]);for(var m=1;m<4;m++)q=t(m),nextCornerId=m+1,4==nextCornerId&&(nextCornerId=0),nextCorner=t(nextCornerId),width=s[2][0]-s[1][0],height=s[0][1]-s[1][1],x=s[1][0],y=s[1][1],(a=u)>Math.abs(height)/2&&(a=Math.floor(Math.abs(height)/2)),a>Math.abs(width)/2&&(a=Math.floor(Math.abs(width)/2)),height<0?(x_tl=x,x_tr=x+width,y_tl=y+height,y_tr=y+height,x_bl=x,x_br=x+width,y_bl=y,y_br=y,b.moveTo(x_bl+a,y_bl),b.lineTo(x_br-a,y_br),b.quadraticCurveTo(x_br,y_br,x_br,y_br-a),b.lineTo(x_tr,y_tr+a),b.quadraticCurveTo(x_tr,y_tr,x_tr-a,y_tr),b.lineTo(x_tl+a,y_tl),b.quadraticCurveTo(x_tl,y_tl,x_tl,y_tl+a),b.lineTo(x_bl,y_bl-a),b.quadraticCurveTo(x_bl,y_bl,x_bl+a,y_bl)):width<0?(x_tl=x+width,x_tr=x,y_tl=y,y_tr=y,x_bl=x+width,x_br=x,y_bl=y+height,y_br=y+height,b.moveTo(x_bl+a,y_bl),b.lineTo(x_br-a,y_br),b.quadraticCurveTo(x_br,y_br,x_br,y_br-a),b.lineTo(x_tr,y_tr+a),b.quadraticCurveTo(x_tr,y_tr,x_tr-a,y_tr),b.lineTo(x_tl+a,y_tl),b.quadraticCurveTo(x_tl,y_tl,x_tl,y_tl+a),b.lineTo(x_bl,y_bl-a),b.quadraticCurveTo(x_bl,y_bl,x_bl+a,y_bl)):(b.moveTo(x+a,y),b.lineTo(x+width-a,y),b.quadraticCurveTo(x+width,y,x+width,y+a),b.lineTo(x+width,y+height-a),b.quadraticCurveTo(x+width,y+height,x+width-a,y+height),b.lineTo(x+a,y+height),b.quadraticCurveTo(x,y+height,x,y+height-a),b.lineTo(x,y+a),b.quadraticCurveTo(x,y,x+a,y));b.fill(),n&&b.stroke()};

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
    return Math.round((number - increment) / increment ) * increment + increment;
}

function privateChartGetDataMakerXY(chart) {
    let dadosTabela = [];
    let count = [];

    //normal, cria lista com os registros
    $.each(chart.data, function (i, e) {

        let x = e[chart.fieldX];
        let y = e[chart.fieldY];

        if(chartFilter.interval === "year" && chart.fieldDate) {
            let xx = x.split('-');
            x = xx[0] + "-" + xx[1] + "-15";
        } else if(chartFilter.interval === "day" && chart.fieldDate) {
            let dateCheck = new RegExp("^\\d{4}-\\d{2}-\\d{2}\\s\\d{2}:\\d{2}:\\d{2}$", "i");
            if(!dateCheck.test(x))
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

    if (chart.operacao === "media") {

        /**
         * Tira a média do valor do campo
         */
        for (let x in dadosTabela) {
            if (!isNaN(dadosTabela[x]))
                dadosTabela[x] = (chart.roundValueStepY ? roundStep(dadosTabela[x] / count[x], chart.stepY) : dadosTabela[x] / count[x]);
        }


    } else if (chart.operacao === "maioria") {

        /**
         * Busca a informação do campo que mais apareceu no período
         */
        for (let x in dadosTabela) {
            if (typeof dadosTabela[x] === "object") {
                let maioria = {y: "", valor: -1};

                for (let y in dadosTabela[x]) {
                    if (y === "removeItem" || y === "pushTo")
                        continue;

                    if (dadosTabela[x][y] > maioria.valor)
                        maioria = {y: y, valor: dadosTabela[x][y]};
                }

                dadosTabela[x] = maioria.y;
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
    $.each(chart.data, function (i, e) {
        if (typeof dd[e[chart.fieldY]] === "undefined")
            dd[e[chart.fieldY]] = 0;

        dd[e[chart.fieldY]]++;
    });

    for(let x in dd) {
        if(x !== "pushTo" && x !== "removeItem") {
            chart.labels.push(chart.functionTooltips(x));
            chart.backgroundColor.push(chart.functionColor(x));
            dadosTabela.push(dd[x]);
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
        for(let x in dadosTabela) {
            if(x !== "pushTo" && x !== "removeItem") {
                let y = chart.functionValueY(dadosTabela[x]);
                dataResult.push({x: chart.functionValueX(x), y: y});
                chart.labels.push(chart.functionTooltips(chart.functionValueX(x), y));
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
            if(typeof l === "object" && l.constructor === Array)
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
        getChart: type => {
            let $this = this;
            if (isEmpty($this.data) || isEmpty($this.fieldY)) {
                toast("Gráfico Erro! Data ou campo Y ausente", 7000, "toast-warning");
                return "";
            }

            if(!$this.operacao)
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

            if($this.fieldDate && !$this.minX)
                $this.minX = chartFilter.dateStart;

            if($this.fieldDate && !$this.maxX)
                $this.maxX = chartFilter.dateEnd;

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

                options.legend = {position: "left", reverse: !0};
            } else {

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
                // options.cornerRadius = 2;
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
                            maxTicksLimit: $this.maxY || undefined,
                            stepSize: $this.stepY || undefined,
                            callback: $this.functionLabelY,
                            display: typeof $this.hideLabelY === "undefined"
                        }
                    }],
                    xAxes: [{
                        stacked: true,
                        type: 'time',
                        gridLines: {
                            display: typeof $this.hideLineX === "undefined",
                            color: "#F5F5F5",
                            drawBorder: typeof $this.hideLineY === "undefined",
                            zeroLineWidth: 3,
                            zeroLineColor: "#EEEEEE"
                        },
                        ticks: {
                            padding: 10,
                            max: $this.maxX || undefined,
                            min: $this.minX || undefined,
                            beginAtZero: $this.minX == 0,
                            maxTicksLimit: $this.maxX || undefined,
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
                            unitStepSize: 1,
                            max: $this.maxX || undefined,
                            min: $this.minX || undefined,
                        }
                    }]
                }
            }

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
function humorGrafico(mod) {
    dbLocal.exeRead("humor").then(g => {
        $("#grafico-humor").html(grafico('humor', g, mod));
    });
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

    if(modChart['sono'] === 1) {

        grafico.setFunctionColor(function (color) {
            if (color < 0)
                return "#BF0811";
            else if (color > 0)
                return '#2D92CB';

            return '#606060';
        });

        grafico.setFunctionLabelY(function (title) {
            if (title < 0)
                return "Ruim";
            else if (title > 0)
                return 'Bom';

            return 'Normal';
        });

        grafico.setFunctionTooltips(function (x, y) {
            if (y < 0)
                return "Ruim";
            else if (y > 0)
                return 'Bom';

            return 'Normal';
        })

        grafico.setFunctionValueY(function (y) {
            return y - 5;
        });

        grafico.setMaxY(5);
        grafico.setMinY(-5);
        grafico.setRoundValueStepY();
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
            return Math.floor(y) + ":" + Math.round(y%1 * 60) + " hr";
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
    grafico.setMaxY(12.5);
    grafico.setStepY(2.5);
    grafico.setHideLineX();
    grafico.setHideLabelY();
    grafico.setOperacaoMedia();
    grafico.setTitle("Humor");
    grafico.setFunctionTooltips(function (x, y) {
        y = typeof y === "undefined" && typeof x !== "undefined" ? x : y;
        if (y < 2)
            return "triste";
        else if (y < 5)
            return 'chateado';
        else if (y < 7)
            return 'normal';
        else if (y < 9)
            return 'contente';

        return 'feliz';
    });

    grafico.setFunctionColor(function (color) {
        if (color < 2)
            return "#6849B7";
        else if (color < 5)
            return '#FF5159';
        else if (color < 7)
            return '#606060';
        else if (color < 9)
            return '#7EC8BD';

        return '#2D92CB';
    });

    grafico.setFunctionValueY(function (y) {
        return y + 1.23;
    })

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
    if(typeof mod === "undefined" && typeof modChart[indicador] === "undefined")
        modChart[indicador] = 1;
    else if(typeof mod !== "undefined")
        modChart[indicador] = mod;

    switch (indicador) {
        case 'humor':
            return graficoHumor(registros);
            break;
        case 'sono':
            return graficoSono(registros);
            break;
    }
}

function graficoHeader(indicador) {
    let startDate = {day: '', month: '', year: ''};
    let endDate = {day: '', month: '', year: ''};
    if (haveDate = chartFilter.dateStart && chartFilter.dateEnd) {
        startDate = chartFilter.dateStart.split("-");
        startDate = {day: startDate[2], month: startDate[1], year: startDate[0]};
        endDate = chartFilter.dateEnd.split("-");
        endDate = {day: endDate[2], month: endDate[1], year: endDate[0]};
    }

    return Mustache.render(tpl.graficoHeader, {
        indicador: indicador,
        startDate: startDate,
        endDate: endDate,
        haveDate: haveDate
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
                    dbLocal.exeRead(indicador).then(g => {
                        if (g) {
                            let $graficos = $("<div class='col relative' id='graficos-" + indicador + "'></div>").appendTo("#graficos");
                            $graficos.append(graficoHeader(indicador));
                            let $grafico = $("<div class='col relative' id='grafico-" + indicador + "'></div>").appendTo($graficos);
                            $graficos.append("<div class='col padding-8'></div></div>");
                            $grafico.html(grafico(indicador, g));
                        }
                    });
                    post("site-pstmc", "read-" + indicador, {
                        paciente: paciente
                    }, function (g) {
                        if (g) {
                            $.each(g, function (i, e) {
                                dbLocal.exeCreate(indicador, e);
                            });
                        }
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
    let now = new Date((useStartDateInsteadDateEnd ? chartFilter.dateStart : chartFilter.dateEnd) + " 23:59:59");
    let limit = 0;

    if (chartFilter.interval === "year") {
        var timestmp = new Date().setFullYear(new Date().getFullYear(), 0, 1);
        var yearFirstDay = Math.floor(timestmp / 86400000);
        var today = Math.ceil((now.getTime()) / 86400000);
        limit = today - yearFirstDay - (useStartDateInsteadDateEnd ? 1 : 2);
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
    }
}

function privateChartGetDataFilter(data, indicador, mod) {
    if(indicador === "sono") {
        if(mod === 2) {
            $.each(data, function (i, e) {
                if(!isEmpty(e.start_time) && !isEmpty(e.end_time)) {
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
            if (chartFilter.indicadores.length > 1) {
                let id = chartFilter.indicadores[0];
                $("#graficos-" + chartFilter.indicadores[0]).remove();
                chartFilter.indicadores.splice(0, 1);
                $(".indicador[rel='" + id + "']").removeClass("active")
            }
            chartFilter.indicadores.push(v);
            $(this).addClass("active");
            graficos(v);
        }
    });

    $("#app").off("click", ".graficoArrow").on("click", ".graficoArrow", function () {
        let indicador = $(this).attr("rel");
        let mod = parseInt($(this).attr("data-mod"));
        dbLocal.exeRead(indicador).then(g => {
            $("#grafico-" + indicador).html(grafico(indicador, privateChartGetDataFilter(g, indicador, mod), mod));
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