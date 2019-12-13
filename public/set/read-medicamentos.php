<?php

$paciente = filter_input(INPUT_POST, "paciente", FILTER_DEFAULT, FILTER_REQUIRE_ARRAY);
//$interval = filter_input(INPUT_POST, "interval", FILTER_DEFAULT);

$js = [
    "route" => [
        "action" => "medicine",
        "module" => "doctor"
    ],
    "data" => [
        "patient_id" => (int) $paciente['id'],
        "interval" => "year",
        "intensity" => 1
    ]
];

$json = json_encode($js);

include_once 'apiEpistemic.php';