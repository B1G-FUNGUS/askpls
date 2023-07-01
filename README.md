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

- Add auto-refresh to options page

- Resetting settings for individual sites in options & popup
 - This is not currently possible without lots of janky code; the Chrome API
   does not have an option to unset a content setting, only to delete all
   content settings set by the extension. This leaves a few possible solutions
   which do not look promising:
  1. Record the url AND setting each time a new setting is created, and then,
     whenever a setting is removed, clear ALL settings, and then re-add all of the
     settings that weren't changed. Not a massive deal since we already do that
     for recording a new url, but still inconvenient.
  2. Try and manipulate the files containing the whitelists/blacklists
     themselves, although it is kind of silly for our extension to go this far.
     Still, it would also make it so we don't have to record our set urls
     separately (so no risk of anything getting out of sync).
 - For now the 'default' option is just going to be ignored, in the grand
   scheme of things it doesn't make *that* much sense, considering everything
   should be on a per-site basis. Regardless, sorting it out sooner will
   prevent us from having to rework a lot of code later.

- Path to 1.0
 - Resolve the 'default' issue, even if it is just setting future plans in stone
 - Add per-site prompt

- Add 48x48 icon? remove 64?

- Add license

- Add regular http match

- Add a better read/write system to storage/settings?

- Remove singe-level suffixes from the list? (technically improves
  speed/storage, but those resources are barely used as is)
 - Add IP addr pattern match

- Script to update & compile regex suffix list

- Fix trivial errors that don't interfere with the goal but still cause weird
  behavior

# Known Issues

- Will not work with http sites, or any protocol but https

- This program can't create OR remove whitelists/blacklists that are specific
  to subdomains, so if you have a pre-existing cookie filters with subdomains
  there will be some minor issues

- You can't change whitelists/blaclists set by the extension
