<?php
    $id = (int) $link->getVariaveis()[0];
?>

<div class="container-1200">
    <div class="col relative">
        <div class="col s12 l4 padding-right">
            <div class="col color-theme padding-medium" style="border-top-right-radius: 50px">
                <div class="col relative padding-large">
                    <img src="<?=HOME?>assetsPublic/img/img.png" class="left radius-circle" height="100" width="100" style="width: 100px; height: 100px" />
                </div>
                <div class="col padding-xlarge padding-8">
                    <h2 class="font-bold color-text-theme padding-right col padding-tiny padding-top">Nome do Paciente</h2>
                    <span class="padding-tiny col padding-right">Selecione um paciente na aba <b>Pacientes Recentes</b> ou clique sobre o <b>Pacientes</b> no menu superior para iniciar uma visualização.</span>
                </div>
            </div>
        </div>
        <div class="col s12 l8 padding-left">
            <div class="col padding-medium">
                <h2 class="color-text-theme font-bold col padding-tiny font-xxlarge">Últimas Atualizações</h2>
                <span class="padding-tiny col" style="margin-top: -7px">Abaixo estão as últimas atualizações feitas por seus pacientes cadastrados</span>
                <div class="col margin-top padding-tiny" id="timeline"></div>
            </div>
        </div>
    </div>
</div>

<script>
    if(typeof ID === "undefined")
        var ID = <?= $id ?>;
</script>