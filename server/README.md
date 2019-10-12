# Install #

    docker-compose up -d

# Import Data #

 - Download ONS postcode directory here: http://geoportal.statistics.gov.uk/datasets/ons-postcode-directory-may-2019
 - Unzip and copy ONSPD_MAY_2019_UK.csv to ./server/data/imd/postcodes/
 - Run `docker-compose exec db /var/www/importdata.sh`
