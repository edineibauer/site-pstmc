<div class="col relative">
    <div class="col dashboard-panel">
        <div class="col s12 l5 padding-right">
            <div id="barra-right"></div>
            <img src="public/assets/img/bemvindo.png" width="300" style="width:300px;" class="left" />
            <div class="col padding-xlarge padding-8">
                <h2 class="font-bold color-text-theme padding-right col padding-tiny padding-top">Olá, Dr. <?= $_SESSION['userlogin']['nome'] ?>!</h2>
                <span class="padding-tiny col padding-right">Selecione um paciente na aba <b>Pacientes Recentes</b> ou clique sobre o <b>Pacientes</b> no menu superior para iniciar uma visualização.</span>
            </div>
        </div>
        <div class="col s12 l7 padding-left">
            <div class="padding-xxlarge padding-8">
                <h2 class="color-text-theme font-bold col padding-tiny font-xxlarge">Últimas Atualizações</h2>
                <span class="padding-tiny col" style="margin-top: -7px">Abaixo estão as últimas atualizações feitas por seus pacientes cadastrados</span>
                <div class="col margin-top padding-tiny" id="timeline"></div>
            </div>
        </div>
        <div class="col padding-xxlarge padding-32" id="pacientes">
            <div class="left">
                <h1 class="col color-text-white font-xlarge padding-0">Pacientes Recentes</h1>
            </div>
            <button class="btn right radius-xxlarge padding-large" onclick="addPatient()"
                    style="background: #3E1F55">Adicionar paciente
            </button>

            <div class="col padding-48" id="lista-pacientes">
                <div class="col s12">
                    <h2 class="align-center font-light color-text-white">Carregando lista de pacientes recentes.</h2>
                </div>
            </div>
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
<div class="hide col" id="convite-paciente" style="margin-top: -650px">
    <div id="add-paciente-opaco"></div>
    <div class="padding-small pointer arrowback">
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

        <div class="col">
            <button onclick="closeConvite()" class="loginbtn s-font-large btn color-white">
                Concluir
            </button>
        </div>
        <div class="row clear"><br><br><br><br></div>
    </div>

</div>