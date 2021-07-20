import { LightningElement, wire, track, api } from 'lwc'
import { loadScript } from 'lightning/platformResourceLoader'
// import threekit from '@salesforce/resourceUrl/playerbundle'
import threekit from '@salesforce/resourceUrl/bundle1652'
import addToCart from "@salesforce/apex/commerceActions.addToCart";
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import {
  publish,
  MessageContext
 } from "lightning/messageService";
 import cartChanged from "@salesforce/messageChannel/lightning__commerce_cartChanged";



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
  product
  loaded = false;
  displayAttributes = [];
  configurator;
  url = ''
  modalOpen=false

  handleClick(event, data) {
    // console.log(event.target.value)
    // console.log(event.target.id)
    // console.log()
    this.configurator.setConfiguration({ [event.currentTarget.dataset.attr]: { assetId: event.target.value } })
  }

  handleAddToCart(e) {
    let id = this.configurator.getConfiguration()['Salesforce ID']
    let url = 'https://threekitsdosum21.lightning.force.com'
    let baseUrl = window.location.href.split('.')[0]
    console.log(baseUrl)
    if(baseUrl === 'https://sdodemo-main-166ce2cf6b6-172-17a3ad33012'){
     url = `https://sdodemo-main-166ce2cf6b6-172-17a3ad33012.force.com/B2BLightning/s/product/${id}`} 
    else if (baseUrl === 'https://threekitsdosum21') {
       url = `https://threekitsdosum21.lightning.force.com/lightning/r/Product2/${id}/view`
    }
    window.location.href = url
  }

  getHTML = function ( url, callback ) {

    // Feature detection
    if ( !window.XMLHttpRequest ) return;
  
    // Create new request
    var xhr = new XMLHttpRequest();
    
    // Setup callback
    xhr.onload = function() {
      if ( callback && typeof( callback ) === 'function' ) {
        callback( this.responseXML );
      }
    }
    
    // Get the HTML
    xhr.open( 'GET', url );
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.responseType = 'document';
    xhr.send();
  
  };



  handleAr() {
    let configObj = this.configurator.getConfiguration()
    console.log(configObj)
    if(configObj && Object.keys(configObj).length === 0 && configObj.constructor === Object) {
          let url = window.location.href
        //  window.location.href = url+'?enableAR=true'
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.append('enableAR', true);
        window.location.search = urlParams;
      } else {

    var raw = JSON.stringify({
      "orgId": "3d7df786-ea8f-4e9a-a49d-d42bf15d1498",
      "productId": "dda0c9ec-e688-4bfc-b6da-2329c6922459",
      "productVersion": "1",
      "variant": configObj
    });

    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer a42d3927-62db-46cf-b5c4-9e6388526485",
      },
      body: raw,
      redirect: 'follow'
    };
    fetch("https://preview.threekit.com/api/configurations?bearer_token=a42d3927-62db-46cf-b5c4-9e6388526485&orgId=3d7df786-ea8f-4e9a-a49d-d42bf15d1498", requestOptions)
      .then(response => response.text())  
      .then(result => {
        result = JSON.parse(result)
        let url = 'https://share.demo.threekit.com/https://exocortex.github.io/tk-viewer/?assetId=dda0c9ec-e688-4bfc-b6da-2329c6922459&authToken=149bf2d6-628d-4a80-b243-c395232893e3&environment=preview&orgId=3d7df786-ea8f-4e9a-a49d-d42bf15d1498&showAR=true&showConfigurator=false&stageId=206517f4-aaaa-498c-a055-eced2856bb22'
        url = `${url}&tkcsid=${result.shortId}&enableAR=true`,'_blank'
        // var requestOptions2 = {
        //   method: 'GET',
        //   headers: {
        //     "Content-Type": "application/json",
        //     "Authorization": "Bearer a42d3927-62db-46cf-b5c4-9e6388526485",
        //   },
        //   redirect: 'follow',
        // };
        
        // fetch(url, requestOptions2)
        //   .then(response => {
        //     console.log(response)
        //     return response.text()
        //   })
        //   .then(result => console.log(result))
        //   .catch(error => console.log('error', error));

        this.url = url
        this.modalOpen = true
      })
      .catch(error => console.log('error', error));


  }
  }

  handleCloseModal() {
    this.modalOpen=false
  }


  get assetId() {
    return getFieldValue(this.product.data, ASSET_ID_FIELD)
  }



  get authToken() {
    // replace getFieldValue with getRecord and see if we can get a field in that record?
    return getFieldValue(this.product.data, AUTH_TOKEN_FIELD)
  }
  @api
  get loaded() {
    return !!this.assetId && !!this.authToken
  }
  renderedCallback() {
    window.regeneratorRuntime = undefined
    console.log("RECORDID  ", this.recordId)
    // run once check
    window.regeneratorRuntime = undefined
    // call script loaders...
    Promise.all([loadScript(this, threekit + '/player-bundle.js')])
      // Promise.all([loadScript(this, threekit)])
      .then(() => {
        console.log('loaded')
        window
          .threekitPlayer({
            authToken: this.authToken,
            el: this.template.querySelector('.tkplayer'),
            //   stageId: '27b9cd7e-2bb2-4a18-b788-160743eb4b33',
            //   assetId: "1d5226e9-af8c-472d-af6a-bc4867a4bf5c",
            assetId: this.assetId,
            showConfigurator: false,
            showAR: false,
            showLoadingThumbnail:true,
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
            console.log("DISPLAY ATTRIBUTES:  ", this.displayAttributes)
            if (this.displayAttributes.length === 0 && this.displayAttributes !== null) {
              let arr =[]
              this.configurator.getDisplayAttributes().forEach((element) => {
                if(element.visible) {
                  element.values.forEach((attr, i) => {
                    if(!attr.visible) {
                      element.values.slice(i, i+1)
                    }
                  });
                  element.values.reverse()
                  arr.push(element)

                }
                this.displayAttributes = arr
              });
              if (this.displayAttributes.length === 0) {
                this.displayAttributes = null
              }
            }
            this.loaded = true;
          })

      })
      .catch(error => {
        console.log('Error', error)
      })
  }
}
