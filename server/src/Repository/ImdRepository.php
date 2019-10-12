<?php

declare(strict_types=1);

namespace KingdomCode\CensusData\Repository;

use MongoDB\Database;

class ImdRepository
{
    private $imdCollection;

    public function __construct(Database $database)
    {
        $this->imdCollection = $database->selectCollection('imd');
    }

    public function findByLsoa(array $lsoas)
    {
        return $this->imdCollection->find(
            ['lsoa' => ['$in' => $lsoas]]
        );
    }
}
