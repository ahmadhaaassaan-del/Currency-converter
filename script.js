/* =========================
   TOGGLE PASSWORD
========================= */

function togglePassword(id){

    let input = document.getElementById(id);

    if(input.type === "password"){
        input.type = "text";
    }else{
        input.type = "password";
    }
}

/* =========================
   EMAIL VALIDATION
========================= */

function isValidEmail(email){

    const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(email);
}

/* =========================
   SIGNUP
========================= */

function signupUser(){

    let name =
    document.getElementById("signupName").value.trim();

    let email =
    document.getElementById("signupEmail").value.trim();

    let password =
    document.getElementById("signupPassword").value;

    if(name === "" || email === "" || password === ""){
        alert("Please fill all fields");
        return;
    }

    if(!isValidEmail(email)){
        alert("Please enter a valid email");
        return;
    }

    if(password.length < 6){
        alert("Password must be at least 6 characters");
        return;
    }

    if(localStorage.getItem(email)){
        alert("Email already registered");
        return;
    }

    let user = {
        name,
        email,
        password
    };

    localStorage.setItem(
        email,
        JSON.stringify(user)
    );

    alert("Account created successfully!");

    window.location.href = "login.html";
}

/* =========================
   LOGIN
========================= */

function loginUser(){

    let email =
    document.getElementById("loginEmail").value.trim();

    let password =
    document.getElementById("loginPassword").value;

    if(email === "" || password === ""){
        alert("Enter email and password");
        return;
    }

    let userData =
    localStorage.getItem(email);

    if(!userData){
        alert("Account not found");
        return;
    }

    let user =
    JSON.parse(userData);

    if(user.password !== password){
        alert("Incorrect password");
        return;
    }

    localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
    );

    window.location.href =
    "dashboard.html";
}

/* =========================
   LOAD DASHBOARD
========================= */

function loadDashboard(){

    let user = JSON.parse(
        localStorage.getItem("loggedInUser")
    );

    if(!user){
        window.location.href = "login.html";
        return;
    }

    let welcome =
    document.getElementById("welcomeUser");

    if(welcome){
        welcome.innerHTML =
        `Welcome, ${user.name}`;
    }

    loadCurrencies();
    loadClock();
    createChart();
    updateCounts();
}

/* =========================
   LOGOUT
========================= */

function logoutUser(){

    localStorage.removeItem(
        "loggedInUser"
    );

    window.location.href =
    "login.html";
}

/* =========================
   LIVE CLOCK
========================= */

function loadClock(){

    const clock =
    document.getElementById("liveDate");

    if(!clock) return;

    setInterval(()=>{

        let now = new Date();

        clock.innerHTML =
        now.toLocaleString();

    },1000);
}

/* =========================
   DARK MODE
========================= */

function toggleDarkMode(){

    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "dark-mode"
        )
        ? "dark"
        : "light"
    );
}

window.addEventListener("load",()=>{

    let theme =
    localStorage.getItem("theme");

    if(theme === "dark"){
        document.body.classList.add(
            "dark-mode"
        );
    }

});

/* =========================
   LOAD CURRENCIES
========================= */

function loadCurrencies(){

    let from =
    document.getElementById("fromCurrency");

    let to =
    document.getElementById("toCurrency");

    if(!from || !to) return;

    from.innerHTML = "";
    to.innerHTML = "";

    currencies.forEach(item=>{

        let option1 =
        document.createElement("option");

        option1.value =
        item.currency;

        option1.textContent =
        `${item.flag} ${item.country} (${item.currency})`;

        let option2 =
        document.createElement("option");

        option2.value =
        item.currency;

        option2.textContent =
        `${item.flag} ${item.country} (${item.currency})`;

        from.appendChild(option1);
        to.appendChild(option2);
    });

    from.value = "USD";
    to.value = "PKR";
}

/* =========================
   SWAP
========================= */

function swapCurrencies(){

    let from =
    document.getElementById("fromCurrency");

    let to =
    document.getElementById("toCurrency");

    let temp = from.value;

    from.value = to.value;

    to.value = temp;
}

/* =========================
   CONVERT CURRENCY
========================= */

async function convertCurrency(){

    let amount =
    document.getElementById("amount").value;

    let from =
    document.getElementById("fromCurrency").value;

    let to =
    document.getElementById("toCurrency").value;

    let resultBox =
    document.getElementById("result");

    try{

        let response =
        await fetch(
        `https://open.er-api.com/v6/latest/${from}`
        );

        let data =
        await response.json();

        let rate =
        data.rates[to];

        let converted =
        amount * rate;

        resultBox.innerHTML =
        `${amount} ${from}
        = ${converted.toFixed(2)} ${to}`;

        saveHistory(
            amount,
            from,
            to,
            converted
        );

    }catch(error){

        resultBox.innerHTML =
        "Conversion Failed";

    }
}

/* =========================
   HISTORY
========================= */

function saveHistory(
    amount,
    from,
    to,
    result
){

    let history =
    JSON.parse(
        localStorage.getItem(
            "history"
        )
    ) || [];

    history.unshift({
        amount,
        from,
        to,
        result
    });

    if(history.length > 20){
        history.pop();
    }

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

    updateCounts();
}

/* =========================
   FAVORITES
========================= */

function addFavorite(){

    let from =
    document.getElementById(
        "fromCurrency"
    ).value;

    let to =
    document.getElementById(
        "toCurrency"
    ).value;

    let favorites =
    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    favorites.push(
        `${from}-${to}`
    );

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    updateCounts();

    alert("Added to favorites");
}

/* =========================
   COUNTS
========================= */

function updateCounts(){

    let history =
    JSON.parse(
        localStorage.getItem(
            "history"
        )
    ) || [];

    let favorites =
    JSON.parse(
        localStorage.getItem(
            "favorites"
        )
    ) || [];

    let historyCount =
    document.getElementById(
        "historyCount"
    );

    let favCount =
    document.getElementById(
        "favCount"
    );

    if(historyCount){
        historyCount.innerHTML =
        history.length;
    }

    if(favCount){
        favCount.innerHTML =
        favorites.length;
    }
}

/* =========================
   CHART
========================= */

function createChart(){

    let canvas =
    document.getElementById(
        "currencyChart"
    );

    if(!canvas) return;

    new Chart(canvas,{

        type:"line",

        data:{
            labels:[
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
                "Sun"
            ],

            datasets:[{
                label:"USD → PKR",
                data:[
                    279,
                    280,
                    281,
                    282,
                    281,
                    283,
                    284
                ],
                borderWidth:3,
                tension:0.4
            }]
        },

        options:{
            responsive:true,
            maintainAspectRatio:false
        }

    });

}
