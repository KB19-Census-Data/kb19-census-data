#!/usr/bin/env bash

mongoimport -d kbdb -c imd --type csv --file /var/www/data/imd/imd.csv --fieldFile=/var/www/data/imd/fieldtranslations.txt