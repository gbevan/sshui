/*

    This file is part of sshui https://github.com/gbevan/sshui.

    sshui is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    sshui is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

import { Component,
         ElementRef,
         Inject,
         ViewChild }           from '@angular/core';
import { MatDialogRef,
         MAT_DIALOG_DATA }     from '@angular/material';

import { CredentialsService }  from '../../services/credentials.service';

const fs = require('fs');
const forge = require('node-forge');
const pki = forge.pki;
const rsa = pki.rsa;
const ssh = forge.ssh;

const debug = require('debug').debug('sshui:dialog:credential-add');

const html = require('./credential-add.template.html');
const css = require('./credential-add.css');

@Component({
  selector: 'credential-add-dialog',
  template: html,
  styles: [css]
})
export class CredentialAddDialog {
  @ViewChild('privkeyfile') privkeyfileEl: ElementRef;

  private credential: any = {
    name: '',
    user: `${process.env.USER || ''}`,
    pass: '',
    keySize: 4096,
    privKey: '',
    pubKey: ''
  };

  private keySizeOptions = [
    {value: 1024, label: '1024: quickest'},
    {value: 2048, label: '2048: quicker'},
    {value: 4096, label: '4096: recommended'},
    {value: 8192, label: '8192: stronger'},
    {value: 16384, label: '16384: strongest, can take a while...'}
  ];
  private generatingKey: boolean = false;

  private privKeyFile = '';

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
    this.credential.privKey = '';
    this.credential.pubKey = '';
    this.generatingKey = true;

    rsa.generateKeyPair({
      bits: this.credential.keySize,
      workers: 2
    }, (err: Error, keypair: any) => {
      this.generatingKey = false;

      // TODO: handle error

      this.credential.privKey = ssh.privateKeyToOpenSSH(keypair.privateKey, '');
      this.credential.pubKey = ssh.publicKeyToOpenSSH(keypair.publicKey, `SSHUI_${this.credential.name}`);
    });
  }

  // TODO: copy pubkey to clipboard
//  copyPubKeyToClipboard(pubKey: string) {
//    console.log('TODO: copyPubKeyToClipboard');
//  }

  deleteKeypair() {
    this.credential.privKey = '';
    this.credential.pubKey = '';
  }

  choosePrivKey() {
    this.privkeyfileEl.nativeElement.click();
  }

  loadPrivKey(ev: Event) {
    const fileName: string = (ev.target as any).value;

    this.credential.privKey = fs.readFileSync(fileName).toString();
    this.credential.pubKey = '';

    // Attempt to extract the public key from the private key (RSA only)
    try {
      // convert PEM encoded private key to a forge private key
      const privKey = pki.privateKeyFromPem(this.credential.privKey);

      // Extract public key from the private key
      const pubKey = pki.setRsaPublicKey(privKey.n, privKey.e);

      // encode public key for openssh
      this.credential.pubKey = ssh.publicKeyToOpenSSH(
        pubKey,
        `SSHUI_${this.credential.name}`
      );
    } catch (e) {
      debug('extract public key failed:', e);
      this.credential.pubKey = 'Unable to extract from private key (only RSA keys supported).';
    }
  }

  submit() {
    if (this.credential.id) {
      this.credentialsService.patch(this.credential.id, this.credential);
    } else {
      this.credentialsService.create(this.credential);
    }

    this.dialogRef.close();
  }
}
