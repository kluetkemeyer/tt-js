#!/bin/bash

closure-library/closure/bin/build/depswriter.py \
		--root_with_prefix="tsvtt ../../../tsvtt" \
		> deps.js