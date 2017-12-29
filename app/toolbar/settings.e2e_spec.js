
/*global describe, it, expect, browser, element, by, protractor */
describe('Settings Dialog', () => {

  const EC = protractor.ExpectedConditions;

  it('should open the settings dialog when toolbar button clicked', () =>{
    const settingsButton = element(by.id('settingsButton'));
    expect(settingsButton.isPresent()).toBe(true);
    expect(settingsButton.isDisplayed()).toBe(true);

    return settingsButton.click()
    .then(() => {
      const settingsDialog = element(by.tagName('settings-dialog'));
      expect(settingsDialog.isPresent()).toBe(true);
      expect(settingsDialog.isDisplayed()).toBe(true);

      const timeoutSetting = element(by.name('timeout'));
      expect(timeoutSetting.isPresent()).toBe(true);
      expect(timeoutSetting.isDisplayed()).toBe(true);

      return browser.wait(EC.textToBePresentInElementValue(timeoutSetting, '5', 1000));
    })
    .then(() => {
      const timeoutSetting = element(by.name('timeout'));
      return timeoutSetting
      .sendKeys(protractor.Key.BACK_SPACE)
      .sendKeys('100');
    })
    .then(() => {
      const saveSettingsButton = element(by.id('saveSettingsButton'));
      expect(saveSettingsButton.isPresent()).toBe(true);
      expect(saveSettingsButton.isDisplayed()).toBe(true);

      return saveSettingsButton.click();
    })
    .then(() => {
      const settingsDialog = element(by.tagName('settings-dialog'));
      browser.wait(EC.stalenessOf(settingsDialog), 5000);
      expect(settingsDialog.isPresent()).toBe(false);
    });
  });

  it('should keep the previously updated value in settings', () => {
    const settingsButton = element(by.id('settingsButton'));
    expect(settingsButton.isPresent()).toBe(true);
    expect(settingsButton.isDisplayed()).toBe(true);

    return settingsButton.click()
    .then(() => {
      const settingsDialog = element(by.tagName('settings-dialog'));
      expect(settingsDialog.isPresent()).toBe(true);
      expect(settingsDialog.isDisplayed()).toBe(true);

      const timeoutSetting = element(by.name('timeout'));
      expect(timeoutSetting.isPresent()).toBe(true);
      expect(timeoutSetting.isDisplayed()).toBe(true);

      return browser.wait(EC.textToBePresentInElementValue(timeoutSetting, '100', 1000));
    })
    .then(() => {
      const cancelSettingsButton = element(by.id('cancelSettingsButton'));
      expect(cancelSettingsButton.isPresent()).toBe(true);
      expect(cancelSettingsButton.isDisplayed()).toBe(true);

      return cancelSettingsButton.click();
    })
    .then(() => {
      const settingsDialog = element(by.tagName('settings-dialog'));
      browser.wait(EC.stalenessOf(settingsDialog), 5000);
      expect(settingsDialog.isPresent()).toBe(false);
//      browser.sleep(5000);
    });
  });
});