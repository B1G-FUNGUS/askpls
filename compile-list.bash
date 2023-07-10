#!/bin/bash

list=$(
	curl https://publicsuffix.org/list/public_suffix_list.dat |
	sed '/^$/d;
		/^\/\//d;
		s/\*\.//;
		s/\./\\./g;
		s/$/|/' | 
	tr -d '\n' | head -c -1)
echo "[^.]*\.($list)$" > suffix_list
