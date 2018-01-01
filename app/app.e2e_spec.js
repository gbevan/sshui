
/*global describe, it, expect, browser, element, by, protractor */
describe('sshui setup', () => {

  const EC = protractor.ExpectedConditions;

  it('should have sshui title on window', function () {
    expect(browser.getTitle()).toMatch('SSH UI');
//    expect(browser.getTitle()).toMatch('Index of /');
  }, 10000)

  it('should have top sshui app tag', () => {
    const e = element(by.tagName('sshui'));
    expect(e.isPresent()).toBe(true);
    expect(e.isDisplayed()).toBe(true);
  });

  describe('first time startup should present form for new vault pw', () => {

    it('should present the newvaultpw tag', () => {
      const e = element(by.tagName('newvaultpw'));
      expect(e.isPresent()).toBe(true);
      expect(e.isDisplayed()).toBe(true);
    });

    it('should allow entry of an initial vault password', () => {
      const pw_form = element(by.id('newVaultPwForm'));
      expect(pw_form.isPresent()).toBe(true);
      expect(pw_form.isDisplayed()).toBe(true);

      const pw_1 = element(by.name('vaultpw'));
      expect(pw_1.isPresent()).toBe(true);
      expect(pw_1.isDisplayed()).toBe(true);

      const pw_2 = element(by.name('vaultpw2'));
      expect(pw_2.isPresent()).toBe(true);
      expect(pw_2.isDisplayed()).toBe(true);

      const button = element(by.id('createVaultButton'));
      expect(button.isPresent()).toBe(true);
      expect(button.isDisplayed()).toBe(true);
    });

    it('should prevent entry of an missmatching vault passwords', () => {
      const pw_1 = element(by.name('vaultpw'));
      const pw_2 = element(by.name('vaultpw2'));
      const button = element(by.id('createVaultButton'));

      expect(button.isEnabled()).toBe(false);

      return pw_1.sendKeys('test123')
      .then(() => {
        expect(button.isEnabled()).toBe(false);

        return pw_2.sendKeys('test');
      })
      .then(() => {
        expect(button.isEnabled()).toBe(false);
        return pw_2
        .sendKeys(Array(5).join(protractor.Key.BACK_SPACE))
        .sendKeys('test1234');
      })
      .then(() => {
        expect(button.isEnabled()).toBe(false);
        return pw_2
        .sendKeys(Array(9).join(protractor.Key.BACK_SPACE))
        .sendKeys('test123');
      })
      .then(() => {
        expect(button.isEnabled()).toBe(true);
        return pw_1
        .sendKeys(Array(9).join(protractor.Key.BACK_SPACE));
      })
      .then(() => {
        return pw_2
        .sendKeys(Array(9).join(protractor.Key.BACK_SPACE));
      })
      .then(() => {
        expect(button.isEnabled()).toBe(false);
      });
    });

    it('should allow entry of an initial vault password to be submitted and login app', () => {
//      const pw_form = element(by.id('newVaultPwForm'));
      const pw_1 = element(by.name('vaultpw'));
      const pw_2 = element(by.name('vaultpw2'));
      const button = element(by.id('createVaultButton'));

      expect(button.isEnabled()).toBe(false);
      return pw_1.sendKeys('test123')
      .then(() => {
        return pw_2.sendKeys('test123');
      })
      .then(() => {
        expect(button.isEnabled()).toBe(true);

  //      pw_form.submit();
        return pw_2.sendKeys(protractor.Key.ENTER);
      })
      .then(() => {
        const toolbar = element(by.tagName('toolbar'));
        browser.wait(EC.presenceOf(toolbar), 5000);

        expect(toolbar.isPresent()).toBe(true);
        expect(toolbar.isDisplayed()).toBe(true);
      });
    });

  });

  describe('should be able to lock and unlock the app using vault pw', () => {

    it('should lock the app when lock is clicked in the toolbar', () => {
      const lockButton = element(by.id('lockButton'));
      return lockButton.click()
      .then(() => {
        const toolbar = element(by.tagName('toolbar'));
        expect(toolbar.isPresent()).toBe(true);
        expect(toolbar.isDisplayed()).toBe(false);

        const vaultpw = element(by.tagName('vaultpw'));
        expect(vaultpw.isPresent()).toBe(true);
        expect(vaultpw.isDisplayed()).toBe(true);
      });
    })

    it('should unlock the app when the vault pw is re-entered', () => {
      const vaultpw = element(by.name('vaultpw'));
      return vaultpw.click().sendKeys('test123' + protractor.Key.ENTER)
      .then(() => {
        const toolbar = element(by.tagName('toolbar'));
        browser.wait(EC.presenceOf(toolbar), 5000);

        expect(toolbar.isPresent()).toBe(true);
        expect(toolbar.isDisplayed()).toBe(true);
      });
    });
  });

  describe('Change Vault Password dialog', () => {

    it('should open the vault menu when clicked and then open the dialog', () => {
      const vaultMenuButton = element(by.id('vaultMenuButton'));
      return vaultMenuButton.click()
      .then(() => {
        const changeVaultPasswordButton = element(by.id('changeVaultPasswordButton'));
        expect(changeVaultPasswordButton.isPresent()).toBe(true);
        expect(changeVaultPasswordButton.isDisplayed()).toBe(true);
        expect(changeVaultPasswordButton.isEnabled()).toBe(true);

        return browser.sleep(250);  // give animation some time
      })
      .then(() => {
        const changeVaultPasswordButton = element(by.id('changeVaultPasswordButton'));
//        return changeVaultPasswordButton.click();
        // Handle menu animation
        browser.actions().mouseMove(changeVaultPasswordButton).click().perform();
      })
      .then(() => {
        const dialogContainer = element(by.tagName('mat-dialog-container'));
        expect(dialogContainer.isPresent()).toBe(true);
        expect(dialogContainer.isDisplayed()).toBe(true);

        const changeVaultPwDialog = element(by.tagName('change-vault-pw-dialog'));
        expect(changeVaultPwDialog.isPresent()).toBe(true);
        expect(changeVaultPwDialog.isDisplayed()).toBe(true);
      });
    });

    it('should accept current vault pw and change it', () => {
      const reEncryptVaultButton = element(by.id('reEncryptVaultButton'));
      expect(reEncryptVaultButton.isPresent()).toBe(true);
      expect(reEncryptVaultButton.isDisplayed()).toBe(true);
      expect(reEncryptVaultButton.isEnabled()).toBe(false);

      const currentPw = element(by.name('current_pw'));
      expect(currentPw.isPresent()).toBe(true);
      expect(currentPw.isDisplayed()).toBe(true);

      const newPw1 = element(by.name('new_pw_1'));
      expect(newPw1.isPresent()).toBe(true);
      expect(newPw1.isDisplayed()).toBe(true);

      const newPw2 = element(by.name('new_pw_2'));
      expect(newPw2.isPresent()).toBe(true);
      expect(newPw2.isDisplayed()).toBe(true);

      return currentPw.sendKeys('test123' + protractor.Key.TAB)
      .then(() => {
        return newPw1.sendKeys('123test' + protractor.Key.TAB);
      })
      .then(() => {
        return newPw2.sendKeys('123test');
      })
      .then(() => {
        expect(reEncryptVaultButton.isEnabled()).toBe(true);

//        return newPw2.sendKeys(protractor.Key.ENTER);
        return reEncryptVaultButton.click();
      })
      .then(() => {
        // dialog should close
        const changeVaultPwDialog = element(by.tagName('change-vault-pw-dialog'));
        browser.wait(EC.stalenessOf(changeVaultPwDialog), 5000);
        expect(changeVaultPwDialog.isPresent()).toBe(false);
      });
    });

  });

  describe('should be able to lock and unlock the app using the changed vault pw', () => {

    it('should lock the app when lock is clicked in the toolbar', () => {
      const lockButton = element(by.id('lockButton'));
      return lockButton.click()
      .then(() => {
        const toolbar = element(by.tagName('toolbar'));
        expect(toolbar.isPresent()).toBe(true);
        expect(toolbar.isDisplayed()).toBe(false);

        const vaultpw = element(by.tagName('vaultpw'));
        expect(vaultpw.isPresent()).toBe(true);
        expect(vaultpw.isDisplayed()).toBe(true);
      });
    })

    it('should unlock the app when the new vault pw is re-entered', () => {
      const vaultpw = element(by.name('vaultpw'));
      return vaultpw.click().sendKeys('123test' + protractor.Key.ENTER)
      .then(() => {
        const toolbar = element(by.tagName('toolbar'));
        browser.wait(EC.presenceOf(toolbar), 5000);

        expect(toolbar.isPresent()).toBe(true);
        expect(toolbar.isDisplayed()).toBe(true);
      });
    });
  });

});
