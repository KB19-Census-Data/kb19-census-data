<?php

declare(strict_types=1);

namespace KingdomCode\CensusData;
use KingdomCode\CensusData\Factory\DatabaseFactory;
use KingdomCode\CensusData\Repository\ImdRepository;
use MongoDB\Client;

class App
{
    private $imdRepository;
    private $postcodeCollection;

    public function __construct()
    {
        $database = DatabaseFactory::createMongoDbConnection("kbdb");
        $this->imdRepository = new ImdRepository($database);
//        $this->postcodeCollection = $this->database->selectCollection("postcode");
    }

    public function run()
    {
        $data = iterator_to_array($this->imdRepository->find([
            'Local Authority District name (2019)' => 'City of London',
        ]));

        $json = json_encode($data);

        header('Content-Type: application/json');

        echo($json);
    }
}
