<?php

declare(strict_types=1);

namespace KingdomCode\CensusData;
use http\Exception\InvalidArgumentException;
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
        $postcode = $_GET['postcode'];
        if (!$this->isValidPostcode($postcode)) {
            throw new InvalidArgumentException();
        }

        //TODO replace with call to retrieve LSOAs within a range of the $postcode
        $lsoas = ['E01000005', 'E01000006'];

        $data = iterator_to_array($this->imdRepository->findByLsoa($lsoas));

        $json = json_encode($data);

        header('Content-Type: application/json');

        echo($json);
    }

    private function isValidPostcode($postcode): bool
    {
        $postcodeFinder = new PostcodesIO();
        return is_null($postcodeFinder->validate($postcode));
    }
}
