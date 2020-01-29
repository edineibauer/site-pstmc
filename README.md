# Site Epistemic

desenvolvido por ag3tecnologia.com.br
#

#####principais tecnologias utilizadas:    
+ Javascript
+ Jquery
+ Chart JS
+ HTML5
+ CSS3
#

## Organização das pastas
/assets

    todos os arquivos JS, CSS, fontes e imagens utilizadas pelo sistema principal e pelas views
    
/get

    possui 2 arquivos JSON que armazenam os dados dos templates e os dados do menus utilizados na dashboard
    
/view

    todos as páginas do site, essas views são carregadas pelo sistema de rotas presente no /assets/appCore.min.js
    
/public/assets/img

    imagens utilizadas nas views
    
/public/param

    alguns parâmetros utilizados por cada view
    
/public/tpl

    templates na linguagem Mustache.js utilizadas nas views (esses templates foram transformados em um JSON que se localiza no caminho "/get/templates.json"
    o JSON passa a ser utilizada nas views, ignorando os templates presentes nesta pasta

/index.html e demais .html

    todos os arquivos HTML na raiz do projeto representam o mesmo arquivo, só foi feito um para cada view para que o mesmo pudesse ser acessado via URL.
    todos dizem respeito ao HTML padrão carregado para qualquer acesso do usuário.
#
## Qualquer dúvida, entrar em contato com o suporte
    contato@ag3tecnologia.com.br
#