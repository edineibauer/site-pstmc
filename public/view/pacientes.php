<div class="container-1200">
    <div class="col padding-xxlarge padding-32 s-padding-large s-padding-24" id="pacientes">
        <div class="left">
            <h1 class="col color-text-white font-xxlarge font-bold padding-0">Pacientes</h1>
            <span class="col color-text-white s-font-small">Selecione um paciente para ver os registros feitos a partir do app Epistemic</span>
        </div>
        <button class="btn right radius-xxlarge padding-large margin-top s-margin-0 s-margin-top" onclick="pedidosPendentes()"
                style="background: #3E1F55">
            <div class="left" style="padding-right: 7px">Pedidos</div>
            <div class="left s-hide">pendentes</div>
        </button>
        <button class="btn right radius-xxlarge padding-large margin-top s-margin-0 s-margin-top" onclick="addPatient()"
                style="background: #3E1F55">
            <div class="left" style="padding-right: 7px">Adicionar</div>
            <div class="left s-hide">paciente</div>
        </button>
        <input type="text" placeholder="Pesquisar" id="search-paciente" class="right padding-left radius-xxlarge padding-medium color-theme" />
        <i class="material-icons right color-text-white padding-small padding-8 pointer" id="btn-search">search</i>

        <div class="col padding-64" id="lista-pacientes">
            <div class="col s12">
<!--                <img src="public/assets/img/bemvindo.png" width="500" style="margin: auto; float: initial; display: block;" />-->
                <h3 class="align-center font-light color-text-white">Carregando...</h3>
            </div>
        </div>
    </div>

    <div class="hide" id="add-paciente">
        <div id="add-paciente-opaco" class="easefadein"></div>
        <div class="padding-small pointer arrowback easefadein" data-fade-delay="500">
            <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
            <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
        </div>

        <div class='row font-large' style="max-width: 410px; margin: auto;position: relative;z-index: 3;">
            <h1 class="color-text-white align-center easefadein header-new-paciente" data-fade-delay="100">
                <div class="font-bold font-xxxlarge s-font-xxlarge">Adicionar Paciente</div>
            </h1>

            <div class="col container-900 padding-top margin-top padding-medium" style="margin-bottom: 40px;">
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

        <div class='row font-large' style="max-width: 500px; margin: auto;position: relative;z-index: 4;margin-top: -450px">
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

    <div class="hide" id="pedidos-pendentes">
        <div id="pedidos-pendentes-opaco"></div>
        <div class="padding-small pointer arrowback easefadein" data-fade-delay="900">
            <i class="material-icons font-xxxlarge left color-text-white">arrow_back</i>
            <div class="left font-xlarge padding-medium color-text-white">Retornar</div>
        </div>

        <div class='row font-large' style="max-width: 500px; margin: auto;position: relative;z-index: 5;margin-top: -300px">
            <div class="color-text-white font-xlarge align-center margin-bottom" style="margin: auto;">
                <h1 class="col font-bold font-xxxlarge padding-tiny easefadein" data-fade-delay="200">Pacientes Pendentes</h1>
                <div class="col font-medium easefadein" data-fade-delay="300">Você esta visualizando os pedidos pendentes de seus possíveis pacientes.</div>
            </div>

            <div class="col padding-64 easefadein color-text-white" data-fade-delay="400">
                Nenhum paciente pendente
            </div>

            <div class="col easefadein" data-fade-delay="500">
                <button onclick="closePendentes()" class="loginbtn s-font-large btn color-white">
                    Concluir
                </button>
            </div>
            <div class="row clear"><br><br><br><br></div>
        </div>

    </div>
</div>