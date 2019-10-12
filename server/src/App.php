<?php

declare(strict_types=1);

namespace KingdomCode\CensusData;
use KingdomCode\CensusData\Factory\DatabaseFactory;
use KingdomCode\CensusData\Repository\ImdRepository;
use KingdomCode\CensusData\Repository\PostcodeRepository;
use MongoDB\Client;

class App
{
    private $imdRepository;
    private $postcodeRepository;

    public function __construct()
    {
        $database = DatabaseFactory::createMongoDbConnection("kbdb");
        $this->imdRepository = new ImdRepository($database);
        $this->postcodeRepository = new PostcodeRepository($database);
    }

    public function run()
    {
        $data = iterator_to_array($this->imdRepository->findByLsoa([
           ['E01000005']
        ]));

        $json = json_encode($data);

        header('Content-Type: application/json');

        echo($json);
    }
}
