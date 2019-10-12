<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use MongoDB\Client;

$client = new Client('mongodb://db');
$dbName = "kbdb";
$database = $client->selectDatabase($dbName);

$imdCollection = $database->selectCollection("imd");
$postcodeCollection = $database->selectCollection("postcode");

$data = iterator_to_array($imdCollection->find([]));

$json = json_encode($data);

header('Content-Type: application/json');

echo($json);
