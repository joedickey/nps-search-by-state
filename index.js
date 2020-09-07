"use strict";

const searchURL = "https://developer.nps.gov/api/v1/parks"
const apiKey = "bb50wi4mrMUQLnhgJVaFJF7lIAhTjH5EDyUsa66J"

//'https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=INSERT-API-KEY-HERE'

function formatParams(params){
    const paramItem = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return paramItem.join('&')
}

function displayResults(jsonResponse) {
    console.log(jsonResponse);
    $('#results-list').empty();
    for (let i = 0; i < jsonResponse.data.length; i++){
        const addressFormat = `${jsonResponse.data[i].addresses[0].line1}<br>${jsonResponse.data[i].addresses[0].city}, ${jsonResponse.data[i].addresses[0].stateCode} ${jsonResponse.data[i].addresses[0].postalCode}`
      $('#results-list').append(
        `<h3>${jsonResponse.data[i].fullName}</h3><p>${jsonResponse.data[i].description}</p><p>${addressFormat}</p><a href="${jsonResponse.data[i].url}" target="_blank">Visit Website</a><hr>`
    )};
    $('#results').removeClass('hidden');
}

function getParksByState(state, maxResults=10){
    const params = {
        api_key: apiKey,
        stateCode: state,
        limit: maxResults
    };

    const queryString = formatParams(params)
    const url = searchURL + "?" + queryString;
    console.log(url);
    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(jsonResponse => {
            if (jsonResponse.total > 0){
                $('#js-error-message').text("");
                displayResults(jsonResponse)  
            }
            else {
                $('#results-list').empty();
                $('#results').addClass('hidden')
                throw new Error('Invalid state code.')
            }
        })
        .catch( err => {
            $('#js-error-message').text(`There is an error: ${err.message}`);
        });
}


function watchForm(){
    $('form').submit( event => {
        event.preventDefault();
        const state = $('#js-state').val();
        const maxResults = $('#js-max-results').val();
        getParksByState(state, maxResults);
        $('#js-state').val("")
    })
    
}

$(watchForm);
