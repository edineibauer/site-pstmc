<?php

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);
$pass = filter_input(INPUT_POST, "password", FILTER_DEFAULT);

$js = [
    "route" => [
        "action" => "login",
        "module" => "doctor"
    ],
    "data" => ["email" => $email, "password" => $pass]
];

$json = json_encode($js);

include_once 'apiEpistemic.php';

if($data['response'] == 1 && is_array($data['data'])) {

    $data['data']['nome'] = $data['data']['name'];
    $data['data']['setor'] = "medico";
    $data['data']['token'] = strtotime("now") . $data['data']['id'] . rand(999, 10000);
    $data['data']['imagem'] = $data['data']['photo_64'];

    $_SESSION['userlogin'] = $data['data'];

    setcookie("token", $_SESSION['userlogin']['token'], time() + (86400 * 360), "/");
}