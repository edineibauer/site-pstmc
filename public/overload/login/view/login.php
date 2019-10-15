<?php
if (!empty($_SESSION['userlogin']['token'])) {
    $data = ["response" => 3, "data" => HOME . "dashboard"];
} else {
    ob_start();
    ?>
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
                <div class="col" id="login-acessar">
                    <button onclick="goToLogin()" class="color-text-theme font-bold loginbtn s-font-large btn pointer relative">
                        Acessar
                    </button>
                </div>
                <div class="col">
                    <p class="color-text-white col align-center margin-bottom padding-bottom easefadein hide" data-fade-delay="200">
                        Conheça a plataforma que conecta médicos a seus pacientes com epilepsia
                    </p>
                </div>
                <div class="col saibamais transition-slow" id="div-saibamais">
                    <div class="color-text-white col align-center font-light padding-top pointer link-login pointer" style="width: 80px;margin: auto; float: initial;" onclick="saibamais()">
                        Saiba mais
                        <div>
                            <div class="radius-circle z-depth-4 color-white" style="width: 23px;height: 23px;margin: 7px auto;">
                                <i class="material-icons">keyboard_arrow_down</i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col s12 l6 body-login easefadein hide" data-fade-delay="700">
                <div class='row container font-large' id="body-login">
                    <div class="container align-center s-padding-bottom s-margin-0 upper panel color-text-grey" id="logoLogin">
                        <img src='<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/logo-icon.png' class="s-hide" height='120'>
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
        <div class="col container-1200">
            <div class="col relative overflow-hidden imgsaibamais">
                <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/SBW1.jpg" class="col" />
            </div>
            <div class="col relative overflow-hidden imgsaibamais">
                <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/SBW2.jpg" class="col" />
            </div>
            <div class="col relative overflow-hidden imgsaibamais">
                <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/SBW4.jpg" class="col" />
            </div>
            <div class="col relative overflow-hidden imgsaibamais">
                <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/SBW5.jpg" class="col" />
            </div>
            <div class="col relative overflow-hidden imgsaibamais">
                <img src="<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/saibamais/SBW3.jpg" class="col" />
            </div>
        </div>
    </div>
    <?php
    $data['data'] = ob_get_contents();
    ob_end_clean();
}