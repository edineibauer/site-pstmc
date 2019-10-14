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
        <p class="font-light col align-center color-text-white margin-0 padding-bottom">Passo 3</p>

        <div class="row clear"></div>

        <div class="col container-900" style="margin-bottom: 50px;margin-top: -20px;">
            <div class="radius-circle color-white" id="cadastro-image1">
                <div class="radius-circle color-white" id="cadastro-image2">
                    <i class="material-icons radius-circle color-text-gray-light">person</i>
                </div>
                <label for="file" class="btn pointer padding-0 radius-circle color-white" id="add_circle">
                    <i class="material-icons">add_circle</i>
                </label>
                <input name="file" class="hide" type="file"
                       id="file" data-format="source" data-column="file" min="1" max="1" accept=".png,.jpg,.jpeg,.gif,.webp,.bmp"/>
            </div>
            <h2 class="align-center color-text-white font-light">Selecione uma foto de perfil</h2>
            <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="termos">
                <span class="rest input-message color-text-white" rel="termos"></span>
            </div>
            <input type="hidden" id="foto" />
        </div>

        <div class="padding-top" style="margin: auto;display: block;width: 275px;">
            <input type="checkbox" id="termos" />
            <div onclick="openTermos()" class="left color-text-white padding-small padding-8 pointer" style="text-decoration: underline!important;">
                Aceitar termos e condições
            </div>
        </div>

        <div class="row col padding-top">
            <button onclick="avancar()" class="loginbtn s-font-large btn color-white theme-text">
                Concluir
            </button>
        </div>
        <div class="row clear"><br><br><br><br></div>
    </div>


<?php
$data['data'] = ob_get_contents();
ob_end_clean();