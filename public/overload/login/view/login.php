<?php
if (!empty($_SESSION['userlogin']['token'])) {
    $data = ["response" => 3, "data" => HOME . "dashboard"];
} else {
    ob_start();
    ?>
    <div class="col" id="background-login"></div>
    <div class="row" id="login-card">
        <div class="col s12 m6 body-login padding-128" id="login-title">
            <div id="login-barra"></div>
            <h1 class="color-text-white align-center">
                <div class="font-bold left">Epistemic</div>
                <div class="left font-light">Web</div>
            </h1>
            <p class="color-text-white font-bold col align-center margin-bottom padding-bottom">
                Conheça a plataforma que conecta médicos a seus pacientes com epilepsia
            </p>
            <div class="color-text-white col align-center font-light padding-top pointer link-login pointer" style="width: 80px;margin: auto; float: initial;" onclick="saibamais()">
                Saiba mais
                <div>
                    <div class="radius-circle color-white" style="width: 23px;height: 23px;margin: 7px auto;">
                        <i class="material-icons">keyboard_arrow_down</i>
                    </div>
                </div>
            </div>
        </div>
        <div class="col s12 m6 body-login">
            <div class='row container font-large' id="body-login">
                <div class="container align-center upper panel color-text-grey" id="logoLogin">
                    <img src='<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/logo-icon.png' height='120'
                         style='height: 120px;float: initial;margin:initial'>
                </div>
                <div class='container align-center font-xxlarge font-bold panel color-text-white'
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
    <?php
    $data['data'] = ob_get_contents();
    ob_end_clean();
}