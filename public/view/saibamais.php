<?php
ob_start();
?>
    <div class="col" id="parent">
        <div class="col transition-slow" id="background-login"></div>
        <div class="col" id="login-container">
            <div class="row relative" id="login-card">
                <div class="col s12 body-login padding-128 s-padding-0" id="login-title">
                    <div id="login-barra" class="hide s-hide"></div>
                    <div class="col">
                        <h1 class="color-text-white align-center titleLogin transition-slow" id="login-sitename">
                            <div class="font-bold left">Epistemic</div>
                            <div class="left font-light">Web</div>
                        </h1>
                    </div>
                    <div class="col">
                        <p class="color-text-white col align-center margin-bottom padding-bottom easefadein hide"
                           data-fade-delay="200">
                            Conheça a plataforma que conecta médicos a seus pacientes com epilepsia
                        </p>
                    </div>
                    <div class="col saibamais transition-slow" id="div-saibamais">
                        <div class="color-text-white col align-center font-light padding-top pointer link-login pointer"
                             style="width: 80px;margin: auto; float: initial;" onclick="saibamais()">
                            Saiba mais
                            <div>
                                <div class="radius-circle z-depth-4 color-white"
                                     style="width: 23px;height: 23px;margin: 7px auto;">
                                    <i class="material-icons">keyboard_arrow_down</i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col s12 l6 body-login easefadein hide" data-fade-delay="700">
                    <div class='row container font-large' id="body-login">
                        <div class="container align-center s-padding-bottom s-margin-0 upper panel color-text-grey"
                             id="logoLogin">
                            <img src='<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/logo-icon.png' class="s-hide"
                                 height='120'>
                        </div>
                        <div class='container align-center s-hide bemvindo font-bold panel color-text-white'
                             style="margin-top: 0!important;">Bem-Vindo
                        </div>
                        <div class="row padding-medium">
                            <div class="row">
                                <div class="panel" style="margin: 0!important;">
                                    <label class="row">
                                        <input id="emaillog" placeholder="E-mail" type="email" disabled="disabled"
                                               class="login-input">
                                    </label>
                                    <label class="row">
                                        <input id="passlog" placeholder="Senha" type="password" disabled="disabled"
                                               class="login-input">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="row clearfix" style="padding: 2px"></div>

                        <div class="row padding-medium padding-4">
                            <button id="loginbtn" class="s-font-large btn color-white color-text-theme"
                                    onclick="login();">
                                Entrar
                            </button>
                        </div>

                        <div class="row clearfix"><br></div>

                        <div class="row">
                            <a href="<?= HOME ?>esqueci-a-senha" data-animation="forward"
                               class="font-light color-text-white align-center col link-login"
                               style="margin-right:0;font-size: 16px;">
                                Esqueceu sua senha? <b>Clique aqui</b>
                            </a>
                        </div>
                        <div class="row">
                            <a href="<?= HOME ?>cadastro-usuario" data-animation="forward"
                               class="font-light color-text-white align-center col link-login" style="font-size: 16px;">
                                Não é cadastrado? <b>Clique aqui</b>
                            </a>
                        </div>
                    </div>
                    <div class="clear"><br><br><br></div>
                </div>
            </div>
        </div>

        <div class="col relative" id="saibamais-content">
            <div class="col blocks" id="block1">
                <div class="col container-1200 relative">
                    <div class="col s12 l5 padding-large text1 relative">
                        <h1 class="col font-jumbo padding-0 color-text-white transition-slow">
                            <div class="font-bold left color-text-theme title-block1">Epistemic</div>
                            <div class="left font-light color-text-black title-block1">Web</div>
                        </h1>

                        <div class="col" style="font-size: 16px; line-height: 20px;">
                            A plataforma <b>EpistemicWeb</b> foi desenvolvida para aproximar médicos e seus pacientes
                            com epilepsia.
                            Trabalhando em conjunto com o aplicativo <b>Epistemic</b>, a plataforma registra e armazena
                            os dados inseridos pelos próprios pacientes em seu
                        </div>
                    </div>
                    <div class="col s12 l7 padding-large">
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook1.svg"
                             class="notebook1 col"/>
                    </div>
                </div>
            </div>

            <div class="col blocks" id="block2">
                <div class="col container-1200 relative">
                    <div class="col s12 l6 padding-large relative">
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook2-1.svg"
                             class="notebook21 col"/>
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook2-2.svg"
                             class="notebook22"/>
                    </div>
                    <div class="col s12 l6 padding-large text2">
                        <h1 class="col font-jumbo padding-0 color-text-white transition-slow">
                            <div class="right font-light color-text-black title-block2">Real</div>
                            <div class="right font-bold color-text-theme title-block2">Tracking</div>
                        </h1>

                        <div class="col align-right" style="font-size: 16px; line-height: 20px;">
                            Pensando na agilidade dos processos de acesso aos dados de cada
                            paciente, facilitamos a análise dos registros criando uma tecnologia de sincronização em
                            tempo real.
                            Sendo assim, o médico responsável pelo acompanhamento da doença de seu paciente visualiza
                            novos registros e cadastros logo após eles serem feitos.
                            <br>
                            <br>
                            Com a permissão concedida, o médico pode visualizar diversos registros dentre eles:
                            crises, sono, medicamentos, humor, alimentação, atividades físicas e sintomas.
                        </div>
                    </div>
                </div>
            </div>

            <div class="col blocks" id="block4">
                <div class="col container-1200 relative">
                    <div class="col s12 l5 padding-large text4 relative">
                        <h1 class="col font-jumbo padding-0 color-text-white transition-slow">
                            <div class="font-bold left color-text-theme title-block4">Compare</div>
                            <div class="left font-light color-text-black title-block4">Dados</div>
                        </h1>

                        <div class="col" style="font-size: 16px; line-height: 20px;">
                            Dentre diversas funcionalidades, o EpistemicWeb também permite que o usuário compare dados
                            entre gráficos. Por exemplo, é possível analisar os gráficos de sono e crises ao mesmo
                            tempo, fazendo com que a
                            correlação seja fácil de identificar e facilitando assim a determinação de possíveis
                            gatilhos das crises.

                            Basta selecionar os gráficos indicadores que deseja visualizar para que eles apareçam na
                            timeline interativa.
                        </div>
                    </div>
                    <div class="col s12 l7 padding-large">
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook4.svg"
                             class="notebook4 col"/>
                    </div>
                </div>
            </div>

            <div class="col blocks" id="block5">
                <div class="col container-1200 relative">
                    <div class="col s12 l6 padding-large relative">
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook5.svg"
                             class="notebook5"/>
                    </div>
                    <div class="col s12 l6 padding-large text5">
                        <h1 class="col font-jumbo padding-0 color-text-white transition-slow">
                            <div class="right font-light color-text-black title-block5">Registros</div>
                            <div class="right font-bold color-text-theme title-block5">Analise</div>
                        </h1>

                        <div class="col align-right" style="font-size: 16px; line-height: 20px;">
                            Médicos podem visualizar com clareza, gráficos que demonstram os
                            registros feitos por seus pacientes. Para visualizar os indicadores de
                            pacientes, basta selecionar um paciente na aba, escolher um período, classificar entre dia,
                            semana, mês e ano, e por ultimo, clicar sobre um
                            indicador para adicioná-lo a nossa timeline interativa.
                            <br><br>
                            Vale lembrar que também é possível expandi-la, para que os gráficos possam ser vistos mais
                            de perto, facilitando assim, a
                            visualização dos dados cadastrados.
                        </div>
                    </div>
                </div>
            </div>

            <div class="col blocks" id="block3">
                <div class="col container-1200 relative">
                    <div class="col s12 l5 padding-large text3 relative">
                        <h1 class="col font-jumbo padding-0 color-text-white transition-slow">
                            <div class="font-bold left color-text-theme title-block3">Faça</div>
                            <div class="left font-light color-text-black title-block3">Mais</div>
                        </h1>

                        <div class="col" style="font-size: 16px; line-height: 20px;">
                            Na aba Início, disponibilizamos um resumo das últimas visualizações e registros recentes
                            feitos por pacientes cadastrados.
                            Médicos podem criar seus perfis e editá-los a qualquer momento, bem como adicionar e remover
                            pacientes.
                        </div>
                    </div>
                    <div class="col s12 l7 padding-large">
                        <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/notebook3.png"
                             class="notebook3 col"/>
                    </div>
                </div>
            </div>

            <div class="col padding-16 footer">
                <div class="container-1200">
                    <div class="col s12 l4 padding-large">
                        <h1 class="col padding-0 color-text-white align-center titleLogin titleLogin-bottom transition-slow">
                            <div class="font-bold left">Epistemic</div>
                            <div class="left font-light">Web</div>
                        </h1>
                    </div>
                    <div class="col s12 l8 padding-large">
                        <a href="<?= HOME ?>login"
                           class="color-text-theme font-bold loginbtn-bottom loginbtn s-font-large btn pointer relative">
                            Acessar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
<?php
$data['data'] = ob_get_contents();
ob_end_clean();