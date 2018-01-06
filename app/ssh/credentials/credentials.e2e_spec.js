
/*global describe, it, expect, browser, element, by, protractor, $ */
describe('Credentials Management', () => {

  const EC = protractor.ExpectedConditions;

  it('should open the credentials panel', () => {
    const credentialsPanelHdr = element(by.id('credentialsPanelHdr'));
    return credentialsPanelHdr.click()
    .then(() => {
      const credentials = element(by.tagName('credentials'));
      browser.wait(EC.visibilityOf(credentials), 5000);
      expect(credentials.isDisplayed()).toBe(true);
    });
  });

  it('should show an initial mat-table of zero rows', () => {
    const rows = element.all(by.id('credentialsRow'));
    expect(rows.count()).toBe(0);
  });

  describe('Add', () => {

    it('button should open the add credential dialog', () => {
      const credentialsAddButton = element(by.id('credentialsAddButton'));
      expect(credentialsAddButton.isPresent()).toBe(true);
      expect(credentialsAddButton.isDisplayed()).toBe(true);

      return credentialsAddButton.click()
      .then(() => {
        const credentialAddDialog = element(by.tagName('credential-add-dialog'));
        expect(credentialAddDialog.isPresent()).toBe(true);
        expect(credentialAddDialog.isDisplayed()).toBe(true);
      });
    });

    it('should have "Add a new" in the title', () => {
      const title = element(by.css('.mat-dialog-title'));
      expect(title.isPresent()).toBe(true);
      expect(title.isDisplayed()).toBe(true);
      expect(title.getText()).toEqual('Add a new Credential:');
    });

    it('should present the form elements and populate them', () => {
//      const credentialAddForm = element(by.id('credentialAddForm'));
//      const inputs = credentialAddForm.all(by.tagName('input'));

      const name = $('#credentialAddForm').element(by.name('name'));
      expect(name.isPresent()).toBe(true);
      expect(name.isDisplayed()).toBe(true);
      return name.sendKeys('cred1', protractor.Key.TAB)
      .then(() => {
        const user = $('#credentialAddForm').element(by.name('user'));
        expect(user.isPresent()).toBe(true);
        expect(user.isDisplayed()).toBe(true);
        return user.sendKeys('user1', protractor.Key.TAB);
      })
      .then(() => {
        const pass = $('#credentialAddForm').element(by.name('pass'));
        expect(pass.isPresent()).toBe(true);
        expect(pass.isDisplayed()).toBe(true);
        expect(pass.getAttribute('type')).toBe('password')
        return pass.sendKeys('pass001', protractor.Key.TAB);
      });
    });

    it('should allow selection of ssh key size via drop-down menu', () => {
      const selectKeySize = $('#credentialAddForm').element(by.id('selectKeySize'));
      expect(selectKeySize.isPresent()).toBe(true);
      expect(selectKeySize.isDisplayed()).toBe(true);
      return selectKeySize.click()
      .then(() => {
        const selectSshKey = {};
        [1024, 2048, 4096, 8192, 16384].forEach((ksize) => {
//          console.log('checking for keysize:', ksize);
          selectSshKey[ksize] = element(by.className(`selectSshKey_${ksize}`));
          browser.wait(EC.visibilityOf(selectSshKey[ksize]), 5000);
          expect(selectSshKey[ksize].isPresent()).toBe(true);
          expect(selectSshKey[ksize].isDisplayed()).toBe(true);
        });

        return selectSshKey[1024].click();
      })
      .then(() => {
        return browser.wait(EC.textToBePresentInElement(selectKeySize, '1024'), 5000);
      })

      // this time select 4096 for the spinner test
      .then(() => {
        return selectKeySize.click()
      })
      .then(() => {
        const selectSshKey = {};
        [1024, 2048, 4096, 8192, 16384].forEach((ksize) => {
//          console.log('checking for keysize:', ksize);
          selectSshKey[ksize] = element(by.className(`selectSshKey_${ksize}`));
          browser.wait(EC.visibilityOf(selectSshKey[ksize]), 5000);
          expect(selectSshKey[ksize].isPresent()).toBe(true);
          expect(selectSshKey[ksize].isDisplayed()).toBe(true);
        });

        return selectSshKey[4096].click();
      });
    });

    it('should generate an ssh key when button pressed and save the cred', () => {
      const pubKey = $('#credentialAddForm').element(by.name('pubKey'));

      const generateSshKeyPairButton = element(by.id('generateSshKeyPairButton'));
      expect(generateSshKeyPairButton.isPresent()).toBe(true);
      expect(generateSshKeyPairButton.isDisplayed()).toBe(true);
      expect(generateSshKeyPairButton.isEnabled()).toBe(true);
      return generateSshKeyPairButton.click()
      .then(() => {
        const sshKeySpinner = element(by.id('sshKeySpinner'));
        browser.wait(EC.presenceOf(sshKeySpinner), 5000);
        browser.wait(EC.stalenessOf(sshKeySpinner), 5000);

        expect(pubKey.isPresent()).toBe(true);
        expect(pubKey.isDisplayed()).toBe(true);
        return browser.wait(EC.textToBePresentInElementValue(pubKey, 'ssh-rsa'), 5000);
      })
      .then(() => {
        const deletePairButton = element(by.id('deletePairButton'));
        expect(deletePairButton.isPresent()).toBe(true);
        expect(deletePairButton.isDisplayed()).toBe(true);
        expect(deletePairButton.isEnabled()).toBe(true);
        return deletePairButton.click();
      })
      .then(() => {
        return browser.wait(EC.textToBePresentInElementValue(pubKey, ''), 5000);
      })
      .then(() => {
        return generateSshKeyPairButton.click();
      })
      .then(() => {
        return browser.wait(EC.textToBePresentInElementValue(pubKey, 'ssh-rsa'), 5000);
      })
      .then(() => {
        // save
        const saveButton = element(by.id('saveButton'));
        expect(saveButton.isPresent()).toBe(true);
        expect(saveButton.isDisplayed()).toBe(true);
        expect(saveButton.isEnabled()).toBe(true);
        return saveButton.click();
      })
      .then(() => {
        const credentialAddDialog = element(by.tagName('credential-add-dialog'));
        return browser.wait(EC.stalenessOf(credentialAddDialog), 5000);
      });
    });

    it('should show a table with one cred row saved', () => {
      const rows = element.all(by.id('credentialsRow'));
      expect(rows.count()).toBe(1);
    });
  });

  describe('Edit', () => {

    it('should open the edit credential dialog on clicking a row\'s edit button', () => {
      const editButton_cred1 = element(by.id('editButton_cred1'));
      expect(editButton_cred1.isPresent()).toBe(true);
      expect(editButton_cred1.isDisplayed()).toBe(true);
      return editButton_cred1.click()
      .then(() => {
        const credentialAddDialog = element(by.tagName('credential-add-dialog'));
        expect(credentialAddDialog.isPresent()).toBe(true);
        expect(credentialAddDialog.isDisplayed()).toBe(true);
      });
    });

    it('should have "Edit" in the title', () => {
      const title = element(by.css('.mat-dialog-title'));
      expect(title.isPresent()).toBe(true);
      expect(title.isDisplayed()).toBe(true);
      expect(title.getText()).toEqual('Edit Credential:');
    });

    it('should have fields filled in from previous add', () => {
      const name = $('#credentialAddForm').element(by.name('name'));
      expect(name.isPresent()).toBe(true);
      expect(name.isDisplayed()).toBe(true);
      browser.wait(EC.textToBePresentInElementValue(name, 'cred1'), 5000);

      const user = $('#credentialAddForm').element(by.name('user'));
      expect(user.isPresent()).toBe(true);
      expect(user.isDisplayed()).toBe(true);
      browser.wait(EC.textToBePresentInElementValue(user, 'user1'), 5000);

      const pass = $('#credentialAddForm').element(by.name('pass'));
      expect(pass.isPresent()).toBe(true);
      expect(pass.isDisplayed()).toBe(true);
      expect(pass.getAttribute('type')).toBe('password')
      browser.wait(EC.textToBePresentInElementValue(pass, 'pass001'), 5000);

      const pubKey = $('#credentialAddForm').element(by.name('pubKey'));
      expect(pubKey.isPresent()).toBe(true);
      expect(pubKey.isDisplayed()).toBe(true);
      browser.wait(EC.textToBePresentInElementValue(pubKey, 'ssh-rsa'), 5000);
    });

    it('should close when cancel button clicked', () => {
      const cancelButton = element(by.id('cancelButton'));
      return cancelButton.click()
      .then(() => {
        const credentialAddDialog = element(by.tagName('credential-add-dialog'));
        return browser.wait(EC.stalenessOf(credentialAddDialog), 5000);
//        browser.sleep(5000);
      });
    });

  });

});
