<?php

$medico = filter_input(INPUT_POST, "medico", FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);

$js = [
    "route" => [
        "action" => "update",
        "module" => "doctor"
    ],
    "data" => $medico
];

$json = json_encode($js);

include_once 'apiEpistemic.php';