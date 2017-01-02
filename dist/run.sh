#!/bin/bash
CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Build container
docker build -t tokenservice:production -f $CWD/Dockerfile $CWD

# Run container
docker run -d -p 3000:80 -v $CWD/..:/var/auth --name=tokenservice tokenservice:production
