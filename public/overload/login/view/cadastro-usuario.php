<?php
ob_start();
?>
    <div class="col" id="background-login"></div>
    <div class="padding-small pointer opacity hover-opacity-off" id="arrowback">
        <i class="material-icons font-xxlarge color-text-white">arrow_back</i>
    </div>

    <div class='row font-large no-select' id="cadastro-login" style="max-width: 750px; margin: auto;position: relative;z-index: 1;">
        <div class="col align-center" style="padding-top: 50px">
            <img src='<?= HOME . VENDOR ?>/site-pstmc/public/assets/img/logo-icon.png' height='120'
                 style='height: 120px;float: initial;margin:initial'>
        </div>
        <h2 class="color-text-white align-center" style="margin: auto; width: 200px">
            <div class="font-bold left">Epistemic</div>
            <div class="left font-light">Web</div>
        </h2>
        <p class="font-light col align-center color-text-white margin-0 padding-bottom">Passo 1</p>

        <div class="row clear"><br></div>

        <div class="col container-900">
            <div class="col s12 m6 padding-right">
                <label class="row">
                    <input id="nome" placeholder="Nome" type="text"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="nome">
                        <span class="rest input-message" rel="nome"></span>
                    </div>
                </label>
                <label class="row">
                    <input id="nascimento" placeholder="Data de Nascimento" type="text"
                           class="input-field color-white opacity date" pattern="\d{2}\/\d{2}\/\d{4}">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="nascimento">
                        <span class="rest input-message" rel="nascimento"></span>
                    </div>
                </label>
                <label class="row">
                    <input id="cpf" placeholder="CPF" type="text"
                           class="input-field color-white cpf opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="cpf">
                        <span class="rest input-message" rel="cpf"></span>
                    </div>
                </label>
                <label class="row">
                    <input id="crm" placeholder="CRM" type="text"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="crm">
                        <span class="rest input-message" rel="crm"></span>
                    </div>
                </label>
            </div>
            <div class="col s12 m6 padding-left">
                <label class="row">
                    <input id="email" placeholder="E-mail" type="email" disabled="disabled"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="email">
                        <span class="rest input-message" rel="email"></span>
                    </div>
                </label>

                <div class="col" style="margin-bottom: 22px;background: rgba(255,255,255, .5); border-radius: 25px;padding-bottom: 1px;">
                    <label class="row">
                        <input id="senha" placeholder="Senha" type="password" disabled="disabled"
                               class="font-large opacity" style="margin: 20px 35px 0;padding-bottom: 15px;width: calc(100% - 70px)!important; border-bottom: solid 2px rgba(255,255,255,.6)">
                    </label>
                    <label class="row">
                        <input id="senha2" placeholder="Confirmar Senha" type="password" disabled="disabled"
                               class="font-large opacity margin-bottom" style="margin: 12px 35px;width: calc(100% - 70px)!important; border: none!important;">
                    </label>
                </div>
                <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="senha">
                    <span class="rest input-message" rel="senha"></span>
                </div>

                <label class="col">
                    <input id="telefone" placeholder="Telefone" type="tel"
                           class="input-field color-white tel opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="telefone">
                        <span class="rest input-message" rel="telefone"></span>
                    </div>
                </label>
            </div>
        </div>

        <div class="row col" style="padding-top: 40px">
            <button onclick="avancar()" class="loginbtn s-font-large btn color-white theme-text">
                Continuar
            </button>
        </div>
    </div>


<?php
$data['data'] = ob_get_contents();
ob_end_clean();