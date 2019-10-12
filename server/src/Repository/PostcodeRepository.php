<?php

declare(strict_types=1);

namespace KingdomCode\CensusData\Repository;

use MongoDB\Database;

class PostcodeRepository
{
    private $imdCollection;

    public function __construct(Database $database)
    {
        $this->imdCollection = $database->selectCollection('imd');
    }

    public function find(array $query)
    {
        return $this->imdCollection->find($query);
    }
}
