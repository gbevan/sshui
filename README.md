# SSH UI

A GUI app to manage ssh credentials, sessions and persistent tunnels.

A desktop app built using nw.js, Angular and Angular Material.
The goal is to provide secure persistent SSH tunnels into private networks
like AWS VPCs via a Bastion host.  The tunnels can be set to auto restart
after suspend/resume of your workstation (once prompted for the vault password).

All credentials/keys are encrypted in a JSON AES256GCM encrypted vault using
[lowdb](https://github.com/typicode/lowdb).

This project uses the npm project [ssh2](https://github.com/mscdex/ssh2) which is a
pure javascript implementation of of SSH2 client and server.  Therefore this
app does not need to depend upon OpenSSH or Putty etc being installed - it
is completely self-contained.

This project is still pretty much in Alpha - but please feel free to use it
and contribute.

## Downloads

Prebuilt zip packages for linux64, osx64 and win64 are available in
[Releases](https://github.com/gbevan/sshui/releases).

## Screenshots

![Vault Password](docs/img/vaultpw.jpeg)

![Sessions](docs/img/sessions.jpeg)

![Local Tunnels](docs/img/local-tunnels.jpeg)

## LICENSE

[GPL-3.0](https://github.com/gbevan/sshui/blob/master/LICENSE)

## Developer Notes

### Start webpack in watch mode for continuous builds while developing

    $ gulp webpack

### Run the app using nw.js direct from source (no build)

    $ node_modules/nw/nwjs/nw --nwapp=.

TODO: migrate this into gulp

v0.5: this is now achieved by simply running:

    $ gulp run

### Run the protractor E2E UI test suite

(requires protractor installed globally)

    $ DEBUG="sshui:*" protractor ./protractor-conf.js

TODO: migrate this into gulp

v0.5: (make sure webpack has been run, or `gulp` (in watch and webpack mode)):

    $ gulp e2e

### Build package with SDK for debugging

    $ gulp build

Creates the build in the (yep you guessed it) `build/` folder

### Run the built development package with debugging and a temp vault

    $ DEBUG="sshui:*" build/sshui/linux64/sshui --db=/tmp/v

the `--db=/tmp/v` tells sshui to use a different vault db file, for testing.

### Run the app in continuous source edit/webpack with watch modes

    $ gulp

### To build the Release zip files

    $ gulp release

Release packages will be in `'release/sshui - v?.?.?/'`, ready to upload to
github Releases.
