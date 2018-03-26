#!/bin/bash

aws s3 sync build/ s3://food-market-prod
aws s3 cp build/index.html s3://food-market-prod/index.html --cache-control "max-age=30"