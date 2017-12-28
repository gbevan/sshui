/*global describe, it, expect, browser, element, by, protractor */
describe('Manage View', () => {

  const EC = protractor.ExpectedConditions;

  it('should ensure we are in the manage view', () => {
    const toolbarManageButton = element(by.id('toolbarManageButton'));
    expect(toolbarManageButton.isPresent()).toBe(true);
    expect(toolbarManageButton.isDisplayed()).toBe(true);

    return toolbarManageButton.click()
    .then(() => {
      const manageTag = element(by.tagName('manage'));
      expect(manageTag.isPresent()).toBe(true);
      expect(manageTag.isDisplayed()).toBe(true);

      const accordionTag = element(by.tagName('mat-accordion'));
      expect(accordionTag.isPresent()).toBe(true);
      expect(accordionTag.isDisplayed()).toBe(true);

    });
  });

  it('should have panel titles for the accordion panels', () => {
    const sessionsTitle = element(by.id('sessionsTitle'));
    expect(sessionsTitle.isPresent()).toBe(true);
    expect(sessionsTitle.isDisplayed()).toBe(true);

    const localTunnelsTitle = element(by.id('localTunnelsTitle'));
    expect(localTunnelsTitle.isPresent()).toBe(true);
    expect(localTunnelsTitle.isDisplayed()).toBe(true);

    const credentialsTitle = element(by.id('credentialsTitle'));
    expect(credentialsTitle.isPresent()).toBe(true);
    expect(credentialsTitle.isDisplayed()).toBe(true);

    // Sessions - visible
    const sessions = element(by.tagName('sessions'));
    browser.wait(EC.presenceOf(sessions), 5000);

    expect(sessions.isPresent()).toBe(true);
    expect(sessions.isDisplayed()).toBe(true);

    // Local Tunnels - collapsed
    const localTunnels = element(by.tagName('local-tunnels'));
    expect(localTunnels.isPresent()).toBe(true);
    expect(localTunnels.isDisplayed()).toBe(false);

    // Credentials - collapsed
    const credentials = element(by.tagName('credentials'));
    expect(credentials.isPresent()).toBe(true);
    expect(credentials.isDisplayed()).toBe(false);

    browser.sleep(5000);
  });

});
