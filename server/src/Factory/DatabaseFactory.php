<?php

declare(strict_types=1);

namespace KingdomCode\CensusData\Factory;

use MongoDB\Client;

class DatabaseFactory
{
    public static function createMongoDbConnection(string $databaseName)
    {
        $client = new Client('mongodb://db');
        return $client->selectDatabase($databaseName);
    }
}
