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

    public function getPostcodeRecsNearCoordinates(float $lat, float $long, $miles = 2, $limit = 100)
    {
//        $radians = $miles * 3963.192;
        $cursor = $this->database->command([
            'geoNear' => 'postcodes',
            'near' => [
                $long,
                $lat,
            ],
            'spherical' => 'true', // yes cos the earth isn't flat
            'num' => $limit, // limit
            'maxDistance' => $miles,
            'distanceMultiplier' => 3963.192,
        ]);

        $postcodes = [];
        foreach ($cursor->toArray()[0]['results'] as $item) {
            $postcodes[] = $item['obj']['pcd'];
        }

        return $postcodes;
    }

    public function getLSOAsForPostcodes(array $postcodes): array
    {
        $cursor = $this->postcodeCollection->find([
            'pcd' => ['$in' => $postcodes],
        ]);

        $lsoas = [];

        foreach ($cursor as $item) {
            $lsoas[] = $item['lsoa11'];
        }

        return $lsoas;
    }
}
