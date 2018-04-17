#!/bin/bash

#aws s3 mb s3://food-market-prod-root
#aws s3api put-bucket-website --bucket food-market-prod-root --website-configuration file://food-market-prod-root-website.json
#aws s3api put-bucket-cors --bucket food-market-prod-root --cors-configuration file://food-market-s3-cors.json
#aws cloudfront create-distribution --distribution-config file://food-market-prod-root-cf-dist-config.json

#aws s3 mb s3://food-market-prod-www
#aws s3api put-bucket-website --bucket food-market-prod-www --website-configuration file://food-market-website.json
#aws s3api put-bucket-policy --bucket food-market-prod-www --policy file://food-market-prod-www-policy.json
#aws s3api put-bucket-cors --bucket food-market-prod-www --cors-configuration file://food-market-s3-cors.json
aws cloudfront create-distribution --distribution-config file://food-market-prod-www-cf-dist-config.json
