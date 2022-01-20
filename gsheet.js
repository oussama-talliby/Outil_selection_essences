const {google} = require('googleapis')
const keys = require('./keys.json')
 
// Basé sur https://www.youtube.com/watch?v=MiPpQzW_ya0&ab_channel=LearnGoogleSpreadsheets
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ["https://www.googleapis.com/auth/spreadsheets.readonly"]
)

function getDataRange(client, range) {
    const p = new Promise((resolve, reject)=>{
        client.authorize(function(err, token){
            if(err){
                console.log(err)
                return new Promise((resolve, error)=>{})
            }
            else{
                console.log("connecté")
                const promise = gsrun(client, range)
                promise.then((value)=>{
                    resolve(value)
                })
            }
        })
    })  
    return p 
}

function gsrun(cl, range){
    const gsapi = google.sheets({
        version: 'v4',
        auth: cl
    })

    const opt ={
        spreadsheetId: '1ya91BlEzHoI6FegU0FJtEFzFBEWzQEkKc74HARh2zmk',
        range:range
    }

    const promise = new Promise((resolve, reject) => {
        gsapi.spreadsheets.values.get(opt, (err, result)=>{
            // console.log(result.data.values.length, result.data.values[0])
            resolve(result.data.values)
        })
    })
    return promise
}

// getDataRange(client, `'Tableau des essences'!A3:3`)
// getDataRange(client, `'Notice des légendes'!A:B`)
module.exports = {
    client: client,
    getData: getDataRange
}