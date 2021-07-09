import { LightningElement } from 'lwc';

export default class TokenGenerator extends LightningElement {
    urls = '';
    warnClass = 'no-warn';

    malformedUrls = ''
    createTokens(event) {
        console.log("Creating tokens...")
        // var myHeaders = new Headers();
        // myHeaders.append("Authorization", "Bearer 1a27eed3-4bf9-483a-9536-342435b87b32");
        // myHeaders.append("Content-Type", "application/json");
        var raw = JSON.stringify({
            "name": "test",
            "orgId": "3d7df786-ea8f-4e9a-a49d-d42bf15d1498",
            "domains": this.urls,
            "serviceAccountId": "ae3755b8-fd62-4621-8398-f55008e336d3"
        });
        var requestOptions = {
            method: 'POST',
            headers: {'Authorization': 'Bearer 1a27eed3-4bf9-483a-9536-342435b87b32', 'Content-Type': "application/json","Access-Control-Allow-Origin": "*"},
            // mode: 'cors', // no-cors, *cors, same-origin
            body: raw,
            redirect: 'follow'
        };
        fetch("https://preview.threekit.com/api/accesstokens?orgId=3d7df786-ea8f-4e9a-a49d-d42bf15d1498", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    handleChange(event) {

        let urls = event.target.value
        let urlArr = urls.split(',')
        var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
        var regex = new RegExp(expression);
        let newArr = [];
        let malformed = []
        urlArr.forEach((url) => {
            if (url.match(regex)) {
                newArr.push(url.trim())
            } else {
                malformed.push(url)
            }
        })
        this.malformedUrls = malformed.join(', ')

        if (urlArr.length != newArr.length) {
            console.log('WEEWOOOWEEWOOOWEEWOO')
            this.warnClass = 'show-warn';
            console.log(this.malformedUrls)
        }
        this.urls = newArr;
        console.log(newArr)  
    }
}