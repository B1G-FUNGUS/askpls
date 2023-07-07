# Description

Software to prompt you on a site-by-site (really root-domain by root-domain)
basis on whether or not to accept cookies when they are requested by a
site/root domain for the first time

# Legal Notice

The file 'suffix_list.dat' was sourced and modified from
https://github.com/publicsuffix/list, and is licensed under the Mozilla Public
License Version 2.0, which can be found in 'LIST_LICENSE.txt.' The rest of this
software is pending to be licensed.

# Changelog 

# TODO

- update css

- Load settings into memory to read and write from, and only write to storage
  occasionally

- Add badge indicating cookie policy on a site?

- Add auto-refresh to options page

- Path to 1.0:
	1. Testing and final bug-crushing soon

- Add 48x48 icon?

- Add license

- Remove singe-level suffixes from the list? (technically improves
  speed/storage, but those resources are barely used as is)
	- Add IP addr pattern match

- Script to update & compile regex suffix list

- Catch domain exceptions better

# Known Issues

- This program can't create OR remove whitelists/blacklists that are specific
  to subdomains, so if you have a pre-existing cookie filters with subdomains
  there will be some minor issues

- Plenty of unhandled exceptions :D (even less now!)

- cookie being already set issues:
 - you should clear all your cookies before using this extension b/c otherwise
   it prompts you only when new cookies are set
 - if a cookie is set by a domain in a background tab, but then the user closes
   the browser before you set a policy? the wait-list was in memory, so you
   will not get a prompt when you go to that tab with that domain next time
  - neither of these are problems if your default is "session only," which I
    reccomend for use with this program

- setPolicy has some problems if it's called multiple times at once, as it will
  read and write asynchronously
