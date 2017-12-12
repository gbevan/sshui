import { Component,
         Inject }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }  from '@angular/material';

import { CredentialsService }  from '../../services/credentials.service';

const forge = require('node-forge');
const rsa = forge.pki.rsa;
const ssh = forge.ssh;

const html = require('./credential-add.template.html');
const css = require('./credential-add.css');

@Component({
  selector: 'credential-add-dialog',
  template: html,
  styles: [css]
})
export class CredentialAddDialog {
  private credential: any = {
    name: '',
    user: `${process.env.USER}`,
    pass: '',
    privKey: '',
    pubKey: ''
  };

  private keySize = 4096;
  private keySizeOptions = [
    {value: 2048, label: '2048: quickest'},
    {value: 4096, label: '4096: recommended'},
    {value: 8192, label: '8192: stronger'},
    {value: 16384, label: '16384: strongest, can take a while...'}
  ];

  private _db: any;

  constructor(
    private credentialsService: CredentialsService,
    public dialogRef: MatDialogRef<CredentialAddDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data && data.credential) {
      this.credential = data.credential;
    }
  }

  generateSshKeyPair() {
    console.log('generateSshKeyPair clicked keySize:', this.keySize);

    rsa.generateKeyPair({
      bits: this.keySize,
      workers: 2
    }, (err: Error, keypair: any) => {
      // keypair.privateKey, keypair.publicKey
      console.log('keypair:', keypair);

      this.credential.privKey = ssh.privateKeyToOpenSSH(keypair.privateKey, '');
      this.credential.pubKey = ssh.publicKeyToOpenSSH(keypair.publicKey, `SSHUI_${this.credential.name}`);
      console.log('privKey:', this.credential.privKey);
      console.log('pubKey:', this.credential.pubKey);
    });
  }

  copyPubKeyToClipboard(pubKey: string) {
    console.log('TODO: copyPubKeyToClipboard');
  }

  submit() {
    console.log('in submit()');
    if (this.credential.id) {
      this.credentialsService.patch(this.credential.id, this.credential);
    } else {
      this.credentialsService.create(this.credential);
    }

    this.dialogRef.close();
  }
}
