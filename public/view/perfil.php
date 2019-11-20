<div class="container-1200">
    <div class="col padding-top" id="perfil">
        <div class="radius-circle color-white"
             style="overflow: hidden;width: 150px;margin: 70px auto -5px; box-shadow: 0 0 60px 40px bisque;">
            <img class="perfil-photo_64" width="150" height="150" style="height: 150px;width: 150px"/>
        </div>

        <h1 class="col padding-top margin-top align-center color-text-gray-dark font-bold s-font-xlarge"
            style="margin-bottom: -7px; padding-bottom: 0">
            <span>Dr. </span>
            <span class="perfil-name"></span>
        </h1>
        <span class="col align-center font-small font-bold color-text-gray-dark s-margin-bottom">
            <span>CRM </span>
            <span class="perfil-crm"></span>
        </span>

        <button class="btn right radius-xxlarge padding-large s-margin-top" onclick="editPerfil()"
                style="background: #3E1F55">Editar Perfil
        </button>
        <div class="col padding-8"></div>
        <div class="col radius-xxlarge color-theme padding-large">
            <div class="col s12 m5 padding-xxlarge color-text-white s-padding-small s-padding-top">
                <h2 class="padding-0 padding-bottom perfil-name s-font-xlarge"></h2>
                <span class="col padding-tiny">
                    <span class="left" style="padding-right: 5px">Data de Nascimento: </span>
                    <span class="left font-light perfil-birthday"></span>
                </span>
                <span class="col padding-tiny">
                    <span class="left" style="padding-right: 5px">CRM: </span>
                    <span class="left font-light perfil-crm"></span>
                </span>
                <span class="col padding-tiny">
                    <span class="left" style="padding-right: 5px">CPF: </span>
                    <span class="left font-light perfil-cpf"></span>
                </span>
                <span class="col padding-tiny">
                    <span class="left" style="padding-right: 5px">Telefone: </span>
                    <span class="left font-light perfil-phone_number"></span>
                </span>
                <span class="col padding-tiny">
                    <span class="left" style="padding-right: 5px">Email: </span>
                    <span class="left font-light perfil-email"></span>
                </span>
            </div>
            <div class="col s12 m7">
                <div class="col s12 m6 padding-xxlarge color-text-white hide s-padding-small s-padding-24" id="block-address1">
                    <h3 class="padding-0 border-bottom margin-bottom">Endereço 1</h3>
                    <span class="col padding-tiny perfil-address1"></span>
                    <span class="col padding-tiny perfil-tel1"></span>
                </div>
                <div class="col s12 m6 padding-xxlarge color-text-white hide s-padding-small s-padding-24" id="block-address2">
                    <h3 class="padding-0 border-bottom margin-bottom">Endereço 2</h3>
                    <span class="col padding-tiny perfil-address2"></span>
                    <span class="col padding-tiny perfil-tel2"></span>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="col hide" id="edit-perfil">
    <div class="padding-small pointer opacity hover-opacity-off s-padding-medium" id="arrowback">
        <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
        <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
    </div>

    <div class='row font-large no-select padding-top' id="cadastro-login" style="max-width: 750px; margin: auto;position: relative;z-index: 1;">
        <div class="col container-900" style="margin-bottom: 10px;margin-top: -20px;">
            <div class="radius-circle" id="cadastro-image1">
                <div class="radius-circle color-white" id="cadastro-image2">
                    <i class="material-icons radius-circle color-text-gray-light">person</i>
                </div>
                <label for="file" class="btn pointer padding-0 radius-large color-theme" id="add_circle">
                    <i class="material-icons left color-text-white">edit</i>
                    <span class="padding-small left color-text-white padding-right">editar</span>
                </label>
                <input name="file" class="hide" type="file"
                       id="file" data-format="source" data-column="file" min="1" max="1" accept=".png,.jpg,.jpeg,.gif,.webp,.bmp"/>
            </div>
            <h1 class="align-center padding-24 color-text-white font-bold s-font-xlarge">
                <span>Dr. </span>
                <span class="perfil-name"></span>
            </h1>
            <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="foto">
                <span class="rest input-message color-text-white" rel="foto"></span>
            </div>
            <input type="hidden" id="foto" />
        </div>

        <div class="row clear"></div>

        <div class="row container-900">
            <div class="col s12 m6 padding-right s-padding-left">
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
            <div class="col s12 m6 padding-left s-padding-right">
                <label class="row">
                    <input id="email" placeholder="E-mail" type="email" disabled="disabled"
                           class="input-field color-white opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="email">
                        <span class="rest input-message" rel="email"></span>
                    </div>
                </label>

                <div class="col" style="margin-bottom: 20px;background: rgba(255,255,255, .5); border-radius: 25px;padding-bottom: 1px;">
                    <label class="row">
                        <input id="senha" placeholder="Nova Senha" type="password" disabled="disabled"
                               class="font-large color-text-white opacity" style="margin: 20px 35px 0;padding-bottom: 15px;width: calc(100% - 70px)!important; border-bottom: solid 2px rgba(255,255,255,.6)">
                    </label>
                    <label class="row">
                        <input id="senha2" placeholder="Confirmar Nova Senha" type="password" disabled="disabled"
                               class="font-large color-text-white opacity margin-bottom" style="margin: 12px 35px;width: calc(100% - 70px)!important; border: none!important;">
                    </label>
                </div>
                <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="senha">
                    <span class="rest input-message" rel="senha"></span>
                </div>

                <label class="col">
                    <input id="telefone" placeholder="Telefone" type="tel" class="input-field color-white tel opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="telefone">
                        <span class="rest input-message" rel="telefone"></span>
                    </div>
                </label>
            </div>
        </div>

        <div class="row container-900">
            <div class="col s12 m6 padding-right s-padding-left">
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
            </div>
            <div class="col s12 m6 padding-left s-padding-right">
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
            </div>
        </div>

        <div class="row col" style="padding-top: 20px">
            <button onclick="salvarPerfil()" class="loginbtn s-font-large btn color-theme color-text-white">
                Salvar
            </button>
        </div>
        <div class="col padding-48"></div>
    </div>
</div>