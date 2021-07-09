import { LightningElement, wire, track, api } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
// import threekit from '@salesforce/resourceUrl/playerbundle'
import threekit from '@salesforce/resourceUrl/bundle1652'

// this is the right bundle - playerbundle
import { getRecord, getFieldValue } from 'lightning/uiRecordApi'
// import ASSET_ID_FIELD from '@salesforce/schema/Product2.TKB2B__Threekit_Id__c'// sandbox
import ASSET_ID_FIELD from '@salesforce/schema/Product2.tkb2b_assetid__c'// sdo

// import AUTH_TOKEN_FIELD from '@salesforce/schema/Product2.auth_token__c' //dev
import AUTH_TOKEN_FIELD from '@salesforce/schema/Product2.tk_auth_token__c' //sdo

const fields = [ASSET_ID_FIELD, AUTH_TOKEN_FIELD]

export default class DemokitDev extends LightningElement {
  @api recordId
  @wire(getRecord, { recordId: '$recordId', fields })
  // @wire()
  product
  loaded = false;
  displayAttributes = [];
  configurator;
  handleClick(event, data) {
    // console.log(event.target.value)
    // console.log(event.target.id)
    // console.log()
    this.configurator.setConfiguration({[event.currentTarget.dataset.attr]: {assetId: event.target.value}})
}
  get assetId () {
    return getFieldValue(this.product.data, ASSET_ID_FIELD)
  }



  get authToken () {
    console.log("AUTHTOKENFIELD IS",AUTH_TOKEN_FIELD)
    // replace getFieldValue with getRecord and see if we can get a field in that record?
    console.log("****************** product.data is", this.product.data)
    return getFieldValue(this.product.data, AUTH_TOKEN_FIELD)
  }
  renderedCallback () {
    // run once check
    window.regeneratorRuntime = undefined
    // call script loaders...
    Promise.all([loadScript(this, threekit + '/player-bundle.js')])
    // Promise.all([loadScript(this, threekit)])
      .then(() => {
        console.log('loaded')
        let auth = this.authToken;
    console.log('auth', auth)
    console.log('asset', this.assetId)

        window
          .threekitPlayer({
            authToken: auth,
            el: this.template.querySelector('.tkplayer'),
            //   stageId: '27b9cd7e-2bb2-4a18-b788-160743eb4b33',
            //   assetId: "1d5226e9-af8c-472d-af6a-bc4867a4bf5c",
            assetId: this.assetId,
            showConfigurator: false,
            showAR: true,
            // initialConfiguration: {
            //     'Cover Front': {assetId: "9b9e5742-6695-48c1-b414-a84f8675f601"}
            // }
            //   cache: {
            //     maxAge: 500,
            //     scope: "v1.0"
            //   }
          })
          .then(async player => {
            window.player = player;
            this.configurator = await player.getConfigurator()
            await player.when('loaded')
            if (this.displayAttributes.length === 0 ) {
              this.displayAttributes = this.configurator.getAttributes || null;
            }
            console.log(this.displayAttributes);
            this.loaded = true;
          })
          
      })
      .catch(error => {
        console.log('Error', error)
      })
  }
}
