#!/usr/bin/env bash

git rev-parse HEAD > /tmp/.githead
git pull
 [[ `cat /tmp/.githead` != `git rev-parse HEAD` ]] || [[ -z $(pgrep "node") ]]