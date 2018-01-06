/*global describe, it, expect, browser, element, by, protractor, $ */
describe('Sessions Management', () => {
  const EC = protractor.ExpectedConditions;

  it('should open the sessions panel', () => {
    const sessionsPanelHdr = element(by.id('sessionsPanelHdr'));
    return sessionsPanelHdr.click()
    .then(() => {
      const sessions = element(by.tagName('sessions'));
      browser.wait(EC.visibilityOf(sessions), 5000);
      expect(sessions.isDisplayed()).toBe(true);
    });
  });

  it('should show an initial mat-table of zero rows', () => {
    const rows = element.all(by.id('sessionsRow'));
    expect(rows.count()).toBe(0);
  });


  describe('Add', () => {

    it('button should open the add session dialog', () => {
      const sessionsAddButton = element(by.id('sessionsAddButton'));
      expect(sessionsAddButton.isPresent()).toBe(true);
      expect(sessionsAddButton.isDisplayed()).toBe(true);

      return sessionsAddButton.click()
      .then(() => {
        const sessionAddDialog = element(by.tagName('session-add-dialog'));
        expect(sessionAddDialog.isPresent()).toBe(true);
        expect(sessionAddDialog.isDisplayed()).toBe(true);
      });
    });

    it('should have "Add a new" in the title', () => {
      const title = element(by.css('.mat-dialog-title'));
      expect(title.isPresent()).toBe(true);
      expect(title.isDisplayed()).toBe(true);
      expect(title.getText()).toEqual('Add a new SSH session:');
    });

    it('should have a save button that is initially disabled', () => {
      const saveButton = element(by.id('saveButton'));
      expect(saveButton.isPresent()).toBe(true);
      expect(saveButton.isDisplayed()).toBe(true);
      expect(saveButton.isEnabled()).toBe(false);
    })

    it('should present the form elements and populate them', () => {
      const name = $('#sessionAddForm').element(by.name('name'));
      expect(name.isPresent()).toBe(true);
      expect(name.isDisplayed()).toBe(true);
      return name.sendKeys('session1', protractor.Key.TAB)
      .then(() => {
        const host = $('#sessionAddForm').element(by.name('host'));
        expect(host.isPresent()).toBe(true);
        expect(host.isDisplayed()).toBe(true);
        return host.sendKeys('127.0.0.1', protractor.Key.TAB)
      })
      .then(() => {
        // check port default
        const port = $('#sessionAddForm').element(by.name('port'));
        return browser.wait(EC.textToBePresentInElementValue(port, '22'), 5000);
      });
    });

    it('should allow selection of previously entered credential', () => {
      const selectCred = $('#sessionAddForm').element(by.id('selectCred'));
      expect(selectCred.isPresent()).toBe(true);
      expect(selectCred.isDisplayed()).toBe(true);
      return selectCred.click()
      .then(() => {
        const selectCred_cred1 = element(by.className(`selectCred_cred1`));
        browser.wait(EC.visibilityOf(selectCred_cred1), 5000);
        expect(selectCred_cred1.isPresent()).toBe(true);
        expect(selectCred_cred1.isDisplayed()).toBe(true);

        return selectCred_cred1.click();
      });
    });

    it('should have a save button that is now enabled', () => {
      const saveButton = element(by.id('saveButton'));
      expect(saveButton.isPresent()).toBe(true);
      expect(saveButton.isDisplayed()).toBe(true);
      expect(saveButton.isEnabled()).toBe(true);
      return saveButton.click()
      .then(() => {
        // dialog should close
        const sessionAddDialog = element(by.tagName('session-add-dialog'));
        return browser.wait(EC.stalenessOf(sessionAddDialog), 5000);
      });
    });

    it('should show a table with one session row saved', (done) => {
      const rows = element.all(by.id('sessionsRow'));
      expect(rows.count()).toBe(1);
      browser.sleep(5000);
      done();
    });

  });

});
