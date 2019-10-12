#!/usr/bin/env bash

cd "$(dirname "$0")"

mongoimport --drop -d kbdb -c imd --type csv --file /var/www/data/imd/imd.csv --fieldFile=/var/www/data/imd/fieldtranslations.txt
mongoimport --drop -d kbdb -c postcodes --type csv --file /var/www/data/postcodes/ONSPD_MAY_2019_UK_E.csv --headerline
mongo --host db kbdb ./addLocationToPostcodes.js