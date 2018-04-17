#!/bin/bash

aws s3 sync build/ s3://food-market-test-www --cache-control "max-age=604800"
aws s3 cp build/index.html s3://food-market-test-www/index.html --cache-control "max-age=30"