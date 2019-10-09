<div class="container-1200">
    <div class="col padding-xxlarge padding-32" id="pacientes">
        <div class="left">
            <h1 class="col color-text-white font-xxlarge font-bold padding-0">Pacientes</h1>
            <span class="col color-text-white">Selecione um paciente para ver os registros feitos a partir do app Epistemic</span>
        </div>
        <button class="btn right radius-xxlarge padding-large margin-top" onclick="addPatient()"
                style="background: #3E1F55">Adicionar paciente
        </button>
        <input type="text" placeholder="Pesquisar Paciente" id="search-paciente" class="right padding-left radius-xxlarge padding-medium color-theme" />
        <i class="material-icons right color-text-white padding-small padding-8 pointer" id="btn-search">search</i>

        <div class="col padding-128" id="lista-pacientes">
            <div class="col s12">
<!--                <img src="public/assets/img/bemvindo.png" width="500" style="margin: auto; float: initial; display: block;" />-->
                <h2 class="align-center font-light color-text-white">Carregando lista de pacientes.</h2>
            </div>
        </div>
    </div>

    <div class="hide" id="add-paciente">
        <div id="add-paciente-opaco" class="easefadein"></div>
        <div class="padding-small pointer arrowback easefadein" data-fade-delay="500">
            <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
            <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
        </div>

        <div class='row font-large' id="cadastro-login"
             style="max-width: 410px; margin: auto;position: relative;z-index: 3;">
            <h1 class="color-text-white align-center easefadein" data-fade-delay="100"
                style="margin: auto; padding-top: 200px;">
                <div class="font-bold font-xxxlarge left">Adicionar Paciente</div>
            </h1>

            <div class="row clear"><br></div>

            <div class="col container-900 padding-top margin-top" style="margin-bottom: 40px;">
                <label class="col easefadein" data-fade-delay="200">
                    <input id="nome" placeholder="Nome" type="text"
                           class="input-field color-white font-large opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="nome">
                        <span class="rest input-message color-text-white" rel="nome"></span>
                    </div>
                </label>
                <label class="col easefadein" data-fade-delay="300">
                    <input id="telefone" placeholder="Telefone" type="tel"
                           class="input-field color-white font-large tel opacity">
                    <div class="col info-container" style="margin-top: -19px;font-size: 12px;" rel="telefone">
                        <span class="rest input-message color-text-white" rel="telefone"></span>
                    </div>
                </label>
            </div>

            <div class="row col easefadein" data-fade-delay="700">
                <button onclick="enviarconvite()" id="sendconvite" class="loginbtn s-font-large btn color-white">
                    Enviar Convite
                </button>
            </div>
            <div class="row clear"><br><br><br><br></div>
        </div>

    </div>
    <div class="hide" id="convite-paciente">
        <div id="add-paciente-opaco"></div>
        <div class="padding-small pointer arrowback easefadein" data-fade-delay="1200">
            <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
            <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
        </div>

        <div class='row font-large' id="cadastro-login"
             style="max-width: 500px; margin: auto;position: relative;z-index: 4;">
            <div class="color-text-white font-xlarge align-center" style="margin: auto;">
                <div class="col">Parabéns!</div>
                <div class="col">Seu paciente foi adicionado com sucesso.</div>
            </div>

            <div class="col container-900" style="margin-bottom: 20px;">
                <div class="radius-circle color-white" id="cadastro-image1">
                    <div class="radius-circle color-white" id="cadastro-image2">
                        <i class="material-icons radius-circle color-text-gray-light">person</i>
                    </div>
                </div>
                <h2 class="align-center color-text-white font-light" id="convite-nome"></h2>
            </div>

            <div class="col easefadein" data-fade-delay="300">
                <button onclick="closeConvite()" class="loginbtn s-font-large btn color-white">
                    Concluir
                </button>
            </div>
            <div class="row clear"><br><br><br><br></div>
        </div>

    </div>
</div>