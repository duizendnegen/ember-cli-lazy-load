/* jshint expr:true */
import {
  describe,
  it,
  beforeEach,
  afterEach
} from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';

describe('Acceptance: AboutPage', function() {
  let application;

  beforeEach(function() {
    application = startApp();
  });

  afterEach(function() {
    destroyApp(application);
  });

  it('can visit /about', function() {
    visit('/about');

    andThen(function() {
      expect(currentPath()).to.equal('about');
    });
  });

  it('can displays cat item component', function() {
    visit('/about');

    andThen(function() {
      expect(this.$('#cat-item')).be.ok;
    });
  });

});
