<?php
$js = [
    "route" => [
        "action" => "lastModification",
        "module" => "doctor"
    ],
    "doctor_id" => $_SESSION['userlogin']['id']
];

$json = json_encode($js);

include_once 'apiEpistemic.php';