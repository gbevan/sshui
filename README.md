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

## LICENSE

[GPL-3.0](https://github.com/gbevan/sshui/blob/master/LICENSE)
