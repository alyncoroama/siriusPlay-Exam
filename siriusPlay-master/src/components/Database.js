class Database {
    static i;

    static updateFromAPI() {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let data = JSON.parse(this.response);

            if (xhr.status >= 200 && xhr.status < 400) {
                data.forEach(data => {
                   userList.push(new User(data.email, data.balance, data.name, data.password, data.balance_loading_day, data.date_of_birth, data._id));
                });
                Database.userList = userList;
            } else {
                console.clear()
            }
        };
        xhr.open("GET", "https://userlist-31ec.restdb.io/rest/userlist");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-apikey", "5de26f654658275ac9dc20f4");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send();
    };
    static putToAPI(Email, Balance, reason) {
        let id;
        let balance;
        let newDate = new Date();
        let name;
        let password;
        let dob;
        let formattedDate = newDate.getDay() + "/" + newDate.getMonth() + "/" + newDate.getFullYear();
        userList.forEach( user => {
           if(user.matchEmail(Email)) {
               id = user.getid();
               if(reason === "Load") {
                   user.addBalance(Balance);
               } else {
                   user.updateBalance(Balance);
               }
               balance = user.getBalance();
               name = user.getName();
               password = user.getPassword();
               dob = user.getDateOfBirth();
           }
        });
        let data = JSON.stringify({
            "email": Email,
            "balance": balance,
            "name": name,
            "password": password,
            "balance_loading_day": formattedDate,
            "date_of_birth": dob
        });
        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                // console.clear()
            }
        });

        xhr.open("PUT", "https://userlist-31ec.restdb.io/rest/userlist/" + id);
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-apikey", "5de26f654658275ac9dc20f4");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }
    static updateToAPI(Email, Name, Password, NewDate, DateOfBirth) {

        let data = JSON.stringify({
            "email": Email,
            "balance": 100,
            "name": Name,
            "password": Password,
            "balance_loading_day": NewDate,
            "date_of_birth": DateOfBirth
        });

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.clear()
                Database.updateFromAPI();
            }
        });

        xhr.open("POST", "https://userlist-31ec.restdb.io/rest/userlist");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-apikey", "5de26f654658275ac9dc20f4");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }
    static logIn(email, password) {
        this.userList = userList;
        this.i = 0;
        for (this.i in this.userList) {
            if (this.userList[this.i].matchUser(email, password)) {
                return "match";
            }
            if (this.userList[this.i].matchEmail(email)) {
                return "mailMatch";
            }
        }
        return false
    }
    static addUser(Email, Name, Password, DateOfBirth) {
        let newDate = new Date();
        newDate.setDate(newDate.getDate() - 1);
        userList.push(new User(Email, 100, Name, Password, newDate, DateOfBirth));
        Database.userList = userList;
        this.updateToAPI(Email, Name, Password, newDate, DateOfBirth);
    }
    static sendMail(Content) {
        let data = JSON.stringify({
            "to":"valentin99dumitrache@gmail.com",
            "subject": "Sirius Play Feedback",
            "html": "<h1>" + Content + "</h1>" + "<p>"+ Content +"</p>"
    });

        let xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                console.clear()
            }
        });

        xhr.open("POST", "https://userlist-31ec.restdb.io/mail");
        xhr.setRequestHeader("content-type", "application/json");
        xhr.setRequestHeader("x-apikey", "5de26f654658275ac9dc20f4");
        xhr.setRequestHeader("cache-control", "no-cache");

        xhr.send(data);
    }
}

let userList = [];

function User (Email, Balance, Name, Password, BalanceLoadingDay, DateOfBirth, ID) {

    this.email = Email;
    this.balance = Balance;
    this.name = Name;
    this.password = Password;
    this.balanceLoadingDay = BalanceLoadingDay;
    this.dateOfBirth = DateOfBirth;
    this.id = ID;


    this.updateBalance = balance => {
        this.balance = balance;
    };
    this.matchUser = (email, password) => {
        return this.email === email && this.password === password
    };
    this.addBalance = balance => {
        this.balance = this.balance + balance;
    };
    this.matchEmail = email => {
        return this.email === email
    };
    this.getEmail = () => {
        return this.email
    };
    this.getBalance = () => {
        return this.balance
    };
    this.getName = () => {
        return this.name
    };
    this.getPassword = () => {
        return this.password
    };
    this.getBalanceLoadingDay = () => {
        return this.balanceLoadingDay
    };
    this.getDateOfBirth = () => {
        return this.dateOfBirth
    }
    this.getid = () => {
        return this.id
    }
};

export default Database