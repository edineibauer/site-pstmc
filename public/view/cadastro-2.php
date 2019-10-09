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
        <p class="font-light col align-center color-text-white margin-0 font-large padding-bottom">Passo 2</p>

        <div class="row clear"><br></div>

        <div class="col container-900">
            <div class="col s12 m6 padding-right">
                <label for="address1" class="font-xlarge padding-medium col color-text-white">Endereço 1</label>
                <label class="row">
                    <input id="address1" placeholder="Clínica Santo Agostinho" type="text"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="address1">
                        <span class="rest input-message" rel="address1"></span>
                    </div>
                </label>
                <label class="row">
                    <input id="tel1" placeholder="Telefone" type="tel"
                           class="input-field color-white tel opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="tel1">
                        <span class="rest input-message" rel="tel1"></span>
                    </div>
                </label>

                <label style="margin: auto;display: block;width: 220px;">
                    <input type="checkbox" name="1" id="nao1" />
                    <div class="left color-text-white padding-small padding-8 pointer">
                        Desejo não informar
                    </div>
                </label>
            </div>
            <div class="col s12 m6 padding-left">
                <label for="address2" class="font-xlarge padding-medium col color-text-white">Endereço 2</label>
                <label class="row">
                    <input id="address2" placeholder="Hospital das Clínicas" type="text"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="address2">
                        <span class="rest input-message" rel="address2"></span>
                    </div>
                </label>
                <label class="row">
                    <input id="tel2" placeholder="Telefone" type="tel"
                           class="input-field color-white tel opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="tel2">
                        <span class="rest input-message" rel="tel2"></span>
                    </div>
                </label>

                <label style="margin: auto;display: block;width: 220px;">
                    <input type="checkbox" name="2" id="nao2" />
                    <div class="left color-text-white padding-small padding-8 pointer">
                        Desejo não informar
                    </div>
                </label>
            </div>
        </div>

        <div class="col" style="padding-top: 50px">
            <button onclick="avancar()" class="loginbtn s-font-large btn color-white theme-text">
                Continuar
            </button>
        </div>
        <div class="row clear"><br><br><br><br></div>
    </div>


<?php
$data['data'] = ob_get_contents();
ob_end_clean();