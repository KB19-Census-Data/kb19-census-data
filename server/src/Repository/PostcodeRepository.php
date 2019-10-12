<?php

declare(strict_types=1);

namespace KingdomCode\CensusData\Repository;

use MongoDB\Database;

class PostcodeRepository
{
    private $postcodeCollection;

    public function __construct(Database $database)
    {
        $this->postcodeCollection = $database->selectCollection('postcodes');
    }

    public function getLSOAsNearCoordinates(array $query)
    {
//        lsoa11
//        return $this->postcodeCollection->find($query);
    }

    public function getCoordinatesForPostcode(string $postcode)
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
}
