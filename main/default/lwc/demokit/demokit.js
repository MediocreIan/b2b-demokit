import { LightningElement, wire, track, api } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
import threekit from '@salesforce/resourceUrl/playerbundle'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'

// import threekit from '@salesforce/resourceUrl/bundle630'

// this is the right bundle - playerbundle
import { getRecord, getFieldValue } from 'lightning/uiRecordApi'
import ASSET_ID_FIELD from '@salesforce/schema/Product2.TKB2B__Threekit_Id__c'
import AUTH_TOKEN_FIELD from '@salesforce/schema/Product2.auth_token__c'

const fields = [ASSET_ID_FIELD, AUTH_TOKEN_FIELD]

export default class Demokit extends LightningElement {
  @api recordId
  @wire(getRecord, { recordId: '$recordId', fields })
  // @wire()
  product

  get assetId () {
    return getFieldValue(this.product.data, ASSET_ID_FIELD)
  }

  get authToken () {
    // replace getFieldValue with getRecord and see if we can get a field in that record?
    return getFieldValue(this.product.data, AUTH_TOKEN_FIELD)
  }
  renderedCallback () {
    // run once check

    // call script loaders...
    Promise.all([loadScript(this, threekit + '/player-bundle.js')])
    // Promise.all([loadScript(this, threekit)])
      .then(() => {
        console.log('loaded')
        let auth = this.authToken;
    console.log('auth', auth)
        window
          .threekitPlayer({
            authToken: auth,
            el: this.template.querySelector('.tkplayer'),
            //   stageId: '27b9cd7e-2bb2-4a18-b788-160743eb4b33',
            //   assetId: "1d5226e9-af8c-472d-af6a-bc4867a4bf5c",
            assetId: this.assetId,
            showConfigurator: true,
            showAR: true,
            initialConfiguration: {
                'Cover Front': {assetId: "9b9e5742-6695-48c1-b414-a84f8675f601"}
            }
            //   cache: {
            //     maxAge: 500,
            //     scope: "v1.0"
            //   }
          })
          .then(async player => {
            window.player = player;
            let configurator = await player.getConfigurator()
            await player.when('loaded')
            let attrs = configurator.getAttributes();
            console.log(attrs);
          })
      })
      .catch(error => {
        console.log('Error', error)
      })
  }
}
