#!/bin/bash

aws s3 sync build/ s3://food-market-prod-www --cache-control "max-age=86400"
aws s3 cp build/index.html s3://food-market-prod-www/index.html --cache-control "max-age=30"