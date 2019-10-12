<?php

declare(strict_types=1);

namespace KingdomCode\CensusData\Repository;

use MongoDB\Database;
use MongoDB\Driver\Cursor;

class PostcodeRepository
{
    private $postcodeCollection;
    private $database;

    public function __construct(Database $database)
    {
        $this->postcodeCollection = $database->selectCollection('postcodes');
        $this->database = $database;
    }

    public function getLSOAsNearCoordinates(array $query)
    {
//        lsoa11
//        return $this->postcodeCollection->find($query);
    }

    public function getCoordinatesForPostcode(string $postcode): array
    {
        // TODO deal with spaces
        // TODO deal with case
        $postcodeRec = $this->postcodeCollection->findOne([
            'pcd' => $postcode,
        ]);
        return [
            'lat' => $postcodeRec['lat'],
            'long' => $postcodeRec['long'],
        ];
    }

    public function getPostcodeRecsNearCoordinates(float $lat, float $long): Cursor
    {
        $cursor = $this->database->command([
            'geoNear' => 'postcodes',
            'near' => [
                'type' => 'Point',
                // TODO ARE THESE THE RIGHT WAY ROUND?
                'coordinates' => [$lat, $long],
            ],
            'spherical' => 'true',
            'num' => 3,
        ]);
    }
}
