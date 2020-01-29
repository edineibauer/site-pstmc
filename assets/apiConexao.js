/**
 * este script é responsável por fazer a conexão a API da Epistemic
 * usando uma ponte (bridge) pois o destino final esta tendo bloqueado política CORS
 * esta ponte só repassa o request a API e devolve a resposta
 */

/**
 * constante BASE que define o destino da API
 */
const BASE = "https://ag3tecnologia.com.br/bridges/epistemic-bridge-dev.php";

/**
 * responsável por conectar a request a BASE, trata o retorno e devolve o conteúdo caso seja sucesso
 * caso seja erro, lança um erro na promesa
 *
 * @param data
 * @returns {Promise<unknown>}
 */
function apiConexao(data) {
    return new Promise((s, f) => {
        $.ajax({
            type: "POST",
            url: BASE,
            data: data,
            success: function (dados) {
                if (typeof dados.statusCode !== "undefined" && (dados.statusCode === 200 || dados.statusCode === "200") && !isEmpty(dados.body)) {

                    /**
                     * Sucesso, avalia o retorno e lança a devida resposta
                     */
                    dados = JSON.parse(dados.body);
                    if (typeof dados.data === "object" && dados.data !== null && typeof dados.data.error === "string") {
                        toast(dados.data.error, 3500, "toast-warning");
                    } else if (typeof dados.data === "object" && dados.data !== null) {
                        s(dados.data);
                    } else if (typeof dados.data === "string" && dados.data === "successful update") {
                        s(1);
                    } else if (typeof dados.data === "string") {
                        s(dados.data);
                        toast(dados.data, 8000, "toast-warning");
                    }

                    /**
                     * Se não se encaixar nas condições acima, considera como um erro
                     */
                    f("Erro");

                } else if (typeof dados.errorMessage === "string") {

                    /**
                     * Erro no servidor. mostra no console
                     */
                    console.error(dados.errorMessage);
                    f(dados.errorMessage);

                } else {

                    /**
                     * Erro desconhecido
                     */
                    f("Erro no servidor");
                }
            },
            error: function (e) {

                /**
                 * Erro na request
                 */
                toast(e.responseText, 3500, "toast-error");
                f(e.responseText);
            },
            dataType: "json",
        });
    });
}

/**
 * função para uso no sistema para chamadas a API
 *
 * @param action (required)
 * @param data (required)
 * @param module (overload default module doctor)
 * @param param (concat with default param data)
 * @returns {Promise<unknown>}
 */
function apiPost(action, data, module, param) {
    module = module || "doctor";
    param = typeof param !== "undefined" && typeof param === "object" && param.constructor === Object && param !== null ? Object.assign({}, param, {"data": data}) : {"data": data};
    return apiConexao(JSON.stringify(Object.assign({
            "route": {
                "action": action,
                "module": module
            }
        }, param)
    ));
}