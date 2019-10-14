<!DOCTYPE html>
<html lang="pt-br">
<head>
    {include 'head.tpl'}
</head>
<body>
<div id="app">

    <div id="core-header" class="theme">
        {include 'header.tpl'}
    </div>

    <aside id="core-sidebar" class="core-class-container">
        {include 'aside.tpl'}
    </aside>

    {include 'loading.tpl'}

    <div class="core-overlay"></div>
    <div id="core-overlay-div">
        <div id="core-overlay-close">
            <i class="material-icons">close</i>
        </div>
        <div id="core-overlay-content"></div>
    </div>
    <section id="core-content" class="core-class-container"></section>
    <ul id="core-log"></ul>

    <div id="core-upload-progress"><div id="core-upload-progress-bar"></div></div>
    <div class="hide" id="core-header-nav-bottom">
        <nav role="navigation">
            <ul class="core-class-container" style="padding:0">
                <div id="core-menu-custom-bottom" class="left"></div>
            </ul>
        </nav>
    </div>
</div>
{include 'analytics.tpl'}

</body>
</html>