#!/bin/bash

echo What should the version be ?
read VERSION

docker build -t quentinbrohan/dylt:$VERSION .
docker push quentinbrohan/dylt:$VERSION
ssh -i "~/.ssh/aws-ec2-qb.pem" "ubuntu@ec2-54-234-61-225.compute-1.amazonaws.com" "docker pull quentinbrohan/dylt:$VERSION && docker tag quentinbrohan/dylt:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
