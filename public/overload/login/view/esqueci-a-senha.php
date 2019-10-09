<?php
if (!empty($_SESSION['userlogin']['token'])) {
    $data = ["response" => 3, "data" => HOME . "dashboard"];
} else {
    ob_start();
    ?>
    <div class="col" id="background-login"></div>
    <div class="row" id="login-card">
        <div class="padding-small pointer arrowback">
            <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
            <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
        </div>

        <div class="col s12 body-login">
            <div class='row container font-large padding-128' id="body-login">
                <div class="container align-center upper panel color-text-grey" id="logoLogin">
                    <img src='<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/logo-icon.png' height='120'
                         style='height: 120px;float: initial;margin:initial'>
                </div>
                <div class='container align-center font-xxlarge font-bold panel color-text-white'
                     style="margin-top: 0!important;">Recuperação de senha
                </div>
                <div class="col"><br><br></div>
                <div class="row padding-medium">
                    <div class="row">
                        <div class="panel" style="margin: 0!important;">
                            <label class="row">
                                <input id="recovery-email" placeholder="Digite seu Email" type="email" disabled="disabled"
                                       class="login-input">
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row clearfix" style="padding: 2px"></div>

                <div class="row padding-medium padding-4">
                    <button id="loginbtn" class="btn color-white color-text-theme"
                            onclick="recoveryEmail();">
                        Enviar
                    </button>
                </div>

                <div class="row clearfix"><br></div>

                <div class="row">
                    <a href="<?= HOME ?>login" data-animation="forward"
                       class="font-light color-text-white align-center col link-login"
                       style="font-size: 16px;margin-right:0">
                        Fazer login? <b>Clique aqui</b>
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