<?php

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

$js = [
    "user" => $email,
    "route" => [
        "action" => "recover-password",
        "module" => "auth"
    ],
    "data" => ["receive_by" => "e-mail"]
];

$json = json_encode($js);

include_once 'apiEpistemic.php';