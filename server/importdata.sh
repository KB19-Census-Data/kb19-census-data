#!/usr/bin/env bash

mongoimport -d kbdb -c imd --type csv --file ./data/imd/imd.csv --fieldFile=./data/imd/fieldtranslations.txt