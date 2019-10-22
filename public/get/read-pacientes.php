<?php
if(empty($_SESSION['userlogin']['id'])) {
    setcookie("token", "", time() - 1, "/");
} else {

    $js = [
        "route" => [
            "action" => "getPatientList",
            "module" => "doctor"
        ],
        "data" => [
            "doctor_id" => $_SESSION['userlogin']['id']
        ]
    ];

    $json = json_encode($js);

    include_once 'apiEpistemic.php';
}