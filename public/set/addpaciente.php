<?php

$nome = filter_input(INPUT_POST, "name", FILTER_DEFAULT);
$telefone = filter_input(INPUT_POST, "phone_number", FILTER_DEFAULT);

$js = [
    "route" => [
        "action" => "pending",
        "module" => "doctor"
    ],
    "data" => [
        "doctor_id" => $_SESSION['userlogin']['id'],
        "phone_number" => $telefone
    ]
];

$json = json_encode($js);

include_once 'apiEpistemic.php';