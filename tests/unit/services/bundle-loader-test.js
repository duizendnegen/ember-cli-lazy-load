/* jshint expr:true */
import { expect } from 'chai';
import Ember from "ember";
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'service:bundle-loader',
  'Bundle-Loader-Service',
  {
    // Specify the other units that are required for this test.
     needs: ['service:bundle-loader']
  },
  function() {
    beforeEach(function() {
      let service = this.subject();
      service.set("_promises", {});
    });

    // Replace this with your real tests.
    it('exists', function() {
      let service = this.subject();
      expect(service).to.be.ok;
    });

    it('has public method loadBundle', function() {
      let service = this.subject();
      expect(service).to.respondTo("loadBundle");
    });

    it('lazily loads a bundle', function() {
      let service = this.subject();

      service.getScript = function(url){
        return new Ember.RSVP.Promise((resolve) => {
          setTimeout(() => resolve(url), 200);
        });
      };
      service.loadBundle("index").then((url)=>{
        expect(url[0]).equals["index"];
        expect(service._promises["index"]).to.be.ok;
      });
    });

    it('lazily loads dependencies', function() {
      let service = this.subject();

      service.getScript = function(url){
        return new Ember.RSVP.Promise((resolve) => {
          setTimeout(() => resolve(url), 200);
        });
      };
      service.loadBundle("about").then((url)=>{
        expect(url[0]).equals["about"];
        expect(service._promises["index"]).to.be.ok;
        expect(service._promises["about"]).to.be.ok;
      });
    });

    it('lazily loads nested dependencies', function() {
      let service = this.subject();

      service.getScript = function(url){
        return new Ember.RSVP.Promise((resolve) => {
          setTimeout(() => resolve(url), 200);
        });
      };
      service.loadBundle("how").then((url)=>{
        expect(url[0]).equals["how"];
        expect(service._promises["index"]).to.be.ok;
        expect(service._promises["about"]).to.be.ok;
        expect(service._promises["how"]).to.be.ok;
      });
    });
  }
);
