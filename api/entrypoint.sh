#!/bin/bash

/usr/wait-for-it.sh -t 0 db:5432

yarn migrate:dev
yarn seed:dev
yarn dev
