# Description

Software to prompt you on a site-by-site (really root-domain by root-domain)
basis on whether or not to accept cookies when they are requested by a
site/root domain for the first time

# Legal Notice

The file 'suffix_list.dat' was sourced and modified from
https://github.com/publicsuffix/list, and is licensed under the Mozilla Public
License Version 2.0, which can be found in 'LIST_LICENSE.txt.' The rest of this
software is pending to be licensed.

# TODO

- the actual per-site part of the program will probably come in next commit

- add 48x48 icon? remove 64?

- add license

- add regular http match?

- keep suffix list always loaded

- remove singe-level suffixes from the list (might mess with ip address hosts,
  but then you could just check for an ipv4/ipv6 style pattern)

- catch failure to match

- script to update & regex suffix list

# Known Issues

- will not work with http sites, or any protocol but https

- this program can't create OR remove whitelists/blacklists that are specific
  to subdomains, so if you have a pre-existing cookie filters with subdomains
  there will be some minor issues

- no 'default' option, TODO add later?

- you can't change whitelists/blaclists set by the extension
