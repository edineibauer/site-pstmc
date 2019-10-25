<?php
$id = (int)$link->getVariaveis()[0];
?>

<div class="container-1200">
    <div class="col relative padding-24">
        <div class="col s12 l5 padding-right">
            <div class="col color-theme-l1 radius-top-right paciente-box">
                <div id="paciente-info" class="row padding-xlarge padding-16">
                    <h3 class="align-center">carregando...</h3>
                </div>

                <div class="row padding-xlarge margin-bottom padding-4">
                    <h3 class="row" style="padding: 0 0 0 5px">Período</h3>
                    <div class="row padding-4">
                        <div class="col s12 m6">
                            <div class="col padding-bottom">
                                <div class="left padding-small radius-large" style="background: #6F3F99">
                                    <div class="left padding-right padding-tiny font-light">De</div>
                                    <div class="left padding-tiny">
                                        <input type="date" id="date-start" class="color-text-white padding-0 margin-0"
                                               style="width: 130px; border-bottom: none"/>
                                    </div>
                                </div>
                            </div>
                            <div class="col padding-bottom">
                                <div class="left padding-small radius-large" style="background: #6F3F99">
                                    <div class="left padding-right padding-tiny font-light">Até</div>
                                    <div class="left padding-tiny">
                                        <input type="date" id="date-end" class="color-text-white padding-0 margin-0"
                                               style="width: 130px; border-bottom: none"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col s12 m6">
                            <div class="col s6 padding-bottom">
                                <button class="btn radius-large time-week color-theme-l2" rel="day" style="width: 95px">
                                    Dia
                                </button>
                            </div>
                            <div class="col s6 padding-bottom">
                                <button class="btn radius-large time-week color-theme-l2" rel="week"
                                        style="width: 95px">Semana
                                </button>
                            </div>
                            <div class="col s6 padding-bottom">
                                <button class="btn radius-large time-week color-theme-l2 active" rel="month"
                                        style="width: 95px">Mês
                                </button>
                            </div>
                            <div class="col s6 padding-bottom">
                                <button class="btn radius-large time-week color-theme-l2" rel="year"
                                        style="width: 95px">Ano
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row color-theme-d1 padding-xlarge padding-24 radius-top-right">
                    <h3 class="row font-bold" style="padding: 0 0 0 5px">Indicadores</h3>
                    <span class="col font-light font-small" style="margin: -5px 0 0 5px">Selecione os indicadores que deseja visualizar</span>

                    <div class="col padding-8">
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador"
                             rel="alimentacao">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/alimentacao.png"
                                 class="col"/>
                        </div>
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="egg">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/egg.png"
                                 class="col"/>
                        </div>
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador"
                             rel="medicamentos">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/medicamentos.png"
                                 class="col"/>
                        </div>

                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="sintomas">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/sintomas.png"
                                 class="col"/>
                        </div>
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="sono">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/sono.png"
                                 class="col"/>
                        </div>
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="humor">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/humor.png"
                                 class="col"/>
                        </div>

                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="crises">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/crises.png"
                                 class="col"/>
                        </div>
                        <div class="col s6 m3 l4 padding-small pointer scale transition-fast indicador" rel="atividade">
                            <i class="material-icons">done</i>
                            <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/indicadores/atividade.png"
                                 class="col"/>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <div class="col s12 l7 padding-left">
            <div class="col padding-xlarge padding-4 relative">
                <div class="col margin-top padding-tiny relative" id="graficos">
                    <div class="col padding-8">
                        <h2 class="font-bold color-text-theme padding-0">Seja Bem-vindo ao Painel do Paciente!</h2>
                    </div>
                    <span class="color-text-gray font-large font-light">para começar, escolha ao menos um Indicador do lado esquerdo.</span>
                    <div class="col padding-64"></div>
                    <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/grafico.png" class="col" alt="gráfico"/>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    if (typeof ID === "undefined")
        var ID = <?= $id ?>;
</script>