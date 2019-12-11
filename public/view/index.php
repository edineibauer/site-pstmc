<?php

if (!empty($_SESSION['userlogin']))
    $data = ["response" => 3, "data" => HOME . "dashboard"];
else
    $data = ["response" => 3, "data" => HOME . "login"];