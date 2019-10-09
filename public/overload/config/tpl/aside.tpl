<div class="theme core-class-container" id="core-sidebar-header">
    <div id="core-sidebar-perfil" class="core-class-container theme-border-l">
        <span class="hide" id="core-sidebar-imagem"></span>
        <span class="hide" id="core-sidebar-nome"></span>
        <span class="hide" id="core-sidebar-edit"></span>
        <div id="login-aside">
            <i class="material-icons">exit_to_app</i>
        </div>
    </div>
</div>

<div id="core-sidebar-main" class="core-class-container">
    <ul id="core-applications" class="core-class-container"></ul>
    <ul id="core-sidebar-menu" class="core-class-container"></ul>
</div>

<div style="position: absolute;bottom: 0px;left: 0px;width: 250px;height: 50px;padding: 8px;background: #ffffff;box-shadow: 0px 9px 12px 0px;">
    <div onclick="updateCache();" class="theme theme-border-l update-site-btn">
        <i class="material-icons">refresh</i>
        <span>Atualizar</span>
    </div>

    <div onclick="subscribeUser();" class="theme theme-border-l update-site-btn site-btn-push" style="padding:2px 5px; margin-left: 2px;cursor:pointer">
        <i class="material-icons">notifications_active</i>
    </div>
</div>