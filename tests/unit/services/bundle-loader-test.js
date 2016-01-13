/* jshint expr:true */
import { expect } from 'chai';
import {
  describeModule,
  it
} from 'ember-mocha';

describeModule(
  'service:bundle-loader',
  'BundlesService',
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

    it('has public mehtod loadBundle', function() {
      let service = this.subject();
      expect(service).to.respondTo("loadBundle");
    });

  }
);
