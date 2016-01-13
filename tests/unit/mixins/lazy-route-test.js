/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import LazyRouteMixin from 'ember-cli-lazy-load/mixins/lazy-route';
import config from "ember-get-config";

describe('LazyRouteMixin', function() {
  // Replace this with your real tests.
  it('has beforeModel func', function() {
    let LazyRouteObject = Ember.Object.extend(LazyRouteMixin);
    let subject = LazyRouteObject.create();

    expect(subject).to.respondTo("beforeModel");

  });

  it('has bundle prop', function() {
    let LazyRouteObject = Ember.Object.extend(LazyRouteMixin);
    let subject = LazyRouteObject.create();

    expect(subject).to.hasOwnProperty("bundles");

  });

  it('bundle config loaded', function() {
    expect(config.bundles).to.be.ok;
  });
});
