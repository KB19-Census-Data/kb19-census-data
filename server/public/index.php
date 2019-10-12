<?php

declare(strict_types=1);

$data = ['a' => 1, 'b' => 2];

$json = json_encode($data);

header('Content-Type: application/json');

echo($json);
