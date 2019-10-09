<?php

$base = "https://z0ablt93uk.execute-api.sa-east-1.amazonaws.com/dev/doctor_management";

function callAPI($method, $url, $data)
{
    $curl = curl_init();

    switch ($method) {
        case "POST":
            curl_setopt($curl, CURLOPT_POST, 1);
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        case "PUT":
            curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
            if ($data)
                curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
            break;
        default:
            if ($data)
                $url = sprintf("%s?%s", $url, http_build_query($data));
    }

    // OPTIONS:
    curl_setopt($curl, CURLOPT_URL, $url);

    curl_setopt($curl, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($curl, CURLOPT_ENCODING, "gzip, deflate, br");
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_AUTOREFERER, true);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);    # required for https urls
    curl_setopt($curl, CURLOPT_CONNECTTIMEOUT, 15);

    curl_setopt($curl, CURLOPT_HTTPHEADER, array(
        'APIKEY: 111111111111111111111',
        'Content-Type: application/json',
    ));
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);

    // EXECUTE:
    $result = curl_exec($curl);
    if (!$result) {
        die("Connection Failure");
    }
    curl_close($curl);
    return $result;
}

$return = callAPI('POST', $base, $json);

if (!empty($return)) {
    $return = json_decode($return, !0);

    if(isset($return['result']['code']) && !empty($return['data']) && $return['result']['code'] < 300 && $return['result']['code'] > 199) {
        $data = ["response" => 1, "data" => $return['data'], "error" => []];

    } elseif ((isset($return['errorMessage']) && !empty($return['errorMessage'])) || !isset($return['body'])) {
        $data['response'] = 2;
        $data['data'] = "";

        if ($js['route']['action'] === 'recover-password') {
            $data['error'] = "Email não encontrad";
        } elseif ($js['route']['action'] === 'create' && $js['route']['module'] === 'doctor') {
            $data['error'] = "Erro no formulário";
        } elseif ($js['route']['action'] === 'pending' && $js['route']['module'] === 'doctor') {
            $data['error'] = "Paciênte não existe";
        } elseif (!empty($return['errorMessage'])) {
            $data['error'] = (!empty($return['errorType']) ? "tipo do erro: " . trim($return['errorType']) . " => " : "") . $return['errorMessage'];
        } elseif (!empty($return['message']) && is_string($return['message'])) {
            $data['error'] = substr($return['message'], 0, 50) . "...";
        }

    } else {
        $return = json_decode($return['body'], !0);
        if (($return['result']['code'] === 200 || $return['result']['code'] === 202) && empty($return['data']['error'])) {

            if ($return['data'] === "Voce ja enviou convite para esse paciente. Aguarde o(a) paciente aceitar o convite para receber os dados dele(a)") {
                $data['response'] = 2;
                $data['error'] = $return['data'];
                $data['data'] = "";
            } else {
                $data['data'] = $return['data'];
            }

        } else {
            if($return['data'] === "User not found")
                $return['data'] = "Paciente não encontrado";

            $data['data'] = "";
            $data['error'] = $return['data']['error'] ?? $return['data'] ?? "Erro desconhecido";
            $data['response'] = 2;
        }
    }
} else {
    $data['data'] = "";
    $data['response'] = 2;
}