const phoneInputField = document.getElementById("phone");
const messageInputField = document.getElementById("msg");
const info = document.querySelector(".alert-info");
const error = document.querySelector(".alert-error");
const btn = document.querySelector(".btn");

const phoneInput = window.intlTelInput(phoneInputField, {
    preferredCountries: ["es", "fr", "pt", "de", "us", "gb"],
    initialCountry: "auto",
    geoIpLookup: getIp,
    utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
});

function process(event) {
    event.preventDefault();
    const phoneNumber = phoneInput.getNumber();
    const msg = messageInputField.value;

    if (phoneNumber[0] != '+') {        
        error.style.display = "";
        error.innerHTML = `<strong>Invalid phone number</strong>.<br><br>Please, check placeholder value.`;
    } else {
        error.style.display = 'none';
        sendSMS(phoneNumber,msg);
    }
    
}

function getIp(callback) {
    fetch('https://ipinfo.io/json', { headers: { 'Accept': 'application/json' }})
      .then((resp) => resp.json())
      .catch(() => {
        return {
          country: 'es',
        };
      })
      .then((resp) => callback(resp.country));
}

function sendSMS(number, message){
    fetch('https://textbelt.com/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: number,
          message: message,
          key: 'textbelt',
        }),
      }).then(response => {
        return response.json();
      }).then(data => {
        if(data.success == true){
            error.style.display = 'none';
            info.style.display = "";
            info.innerHTML = `<strong>Text ID: </strong>` + data.textId + `<br><br><strong>Quota remaining: </strong>` + data.quotaRemaining;
        }else{
            error.style.display = "";
            error.innerHTML = `<strong>Error: </strong>` + data.error + `<br><br><strong>Quota remaining: </strong>` + data.quotaRemaining;
        }        
      });
}

   