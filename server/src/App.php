<?php

declare(strict_types=1);

namespace KingdomCode\CensusData;
use Jabranr\PostcodesIO\PostcodesIO;
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
        $postcode = urldecode($_GET['postcode']);
//        if (!$this->isValidPostcode($postcode)) {
//            throw new \InvalidArgumentException();
//        }
//        die($postcode);

        $postcode = 'E1  0AB';
        $coordinates = $this->postcodeRepository->getCoordinatesForPostcode($postcode);
        $nearPostcodes = $this->postcodeRepository->getPostcodeRecsNearCoordinates(
            $coordinates['lat'],
            $coordinates['long'],
            2,
            100
        );
        $lsoas = $this->postcodeRepository->getLSOAsForPostcodes($nearPostcodes);

        $lsoas = [
            'E01000043',
            'E01000044',
            'E01000045',
            'E01000046',
            'E01000047',
            'E01000048',
            'E01000049',
            'E01000050',
            'E01000051',
            'E01000052',
        ];

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
