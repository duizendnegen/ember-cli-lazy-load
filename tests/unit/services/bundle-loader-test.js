/* jshint expr:true */
import { assert, expect } from 'chai';
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
          return new Ember.RSVP.Promise((resolve /*,reject*/)=>{
            setTimeout(()=>resolve(url),1000);
          });
      };
      service.loadBundle("index").then((url)=>{
        expect(url[0]).equals["index"];
      });
    });

    it('lazily loads dependencies', function() {
      assert.fail();
    });

    it('lazily loads nested dependencies', function() {
      assert.fail();
    });
  }
);
