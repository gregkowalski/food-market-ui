#!/bin/bash

#aws s3 mb s3://food-market-staging-root
#aws s3api put-bucket-website --bucket food-market-staging-root --website-configuration file://food-market-staging-root-website.json
#aws s3api put-bucket-cors --bucket food-market-staging-root --cors-configuration file://food-market-s3-cors.json
#aws cloudfront create-distribution --distribution-config file://food-market-staging-root-cf-dist-config.json

#aws s3 mb s3://food-market-staging-www
#aws s3api put-bucket-website --bucket food-market-staging-www --website-configuration file://food-market-website.json
#aws s3api put-bucket-policy --bucket food-market-staging-www --policy file://food-market-staging-www-policy.json
#aws s3api put-bucket-cors --bucket food-market-staging-www --cors-configuration file://food-market-s3-cors.json
aws cloudfront create-distribution --distribution-config file://food-market-staging-www-cf-dist-config.json
