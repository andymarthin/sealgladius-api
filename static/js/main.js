var id = '',
    jumlah = '',
    bank = '',
    formModal = $('.cd-user-modal'),
    formLogin = formModal.find('#cd-login');

// login to http://seal-gladius.com/
function login(dataLogin) {
    $.ajax({
    type: "POST",
    url: "/login",
    dataType: 'JSON',
    data: dataLogin,
    cache: false,
    before:function(){
        $('#login-modal').addClass("btn-hide");
        $('#loader').removeClass("btn-hide");
    },
    success: function(data) {
        // var DataUser = {'username': data.data.Username,
        //      'SilverCoin': data.data.SilverCoin,
        //      'GoldCoin': data.data.GoldCoin
        //     };

        // assign data to LocalStorage
        lscache.set("PHPSESSID", data.data.cookies.PHPSESSID, 24);
        // lscache.set("DataUser",  JSON.stringify(DataUser),24);

        formModal.removeClass('is-visible');
        cekCookie();
        // $('#username').text(data.data.Username);
        $('#kirim').removeClass('btn-hide');
        $('#login-btn').addClass('btn-hide');

        // 
        clearFormLogin();

        $('#loader').addClass("btn-hide");
        $('#login-modal').removeClass("btn-hide");
    },
    error: function(xhr){
        var json = JSON.parse(xhr.responseText);
        $.notify(json.data.message, "error");
        $('#loader').addClass("btn-hide");
        $('#login-modal').removeClass("btn-hide");
    }
});
}

//set Silver coin after buy
function setSilverCoin(coin){
    var dataUser = lscache.get("DataUser");
    var DataCoin = {'username': dataUser.Username,
         'SilverCoin': coin,
         'GoldCoin': dataUser.GoldCoin
        };
    var curent_time = Math.floor((new Date().getTime())/( 60 * 1000));
    var dataUserExpire = lscache.get("DataUser-cacheexpiration");
    var newtime = dataUserExpire - curent_time;
    lscache.remove("DataUser");
    lscache.set("DataUser", JSON.stringify(DataCoin),newtime);
    $('#SilverCoin').text(coin);
}

//checking cookies
function cekCookie(){
    var cekCookies = lscache.get("PHPSESSID");

    // delect cookies if expired
    lscache.flushExpired();
    if (cekCookies === null) {
        login_selected();
        $('#login-btn').removeClass('btn-hide');
        $('#kirim').addClass('btn-hide');
        $('#navigasi').addClass('btn-hide');
    }else{
        // var dataUser = lscache.get("DataUser");
        // $('#username').text(dataUser.username);
        // $('#SilverCoin').text(dataUser.SilverCoin);
        // $('#GoldCoin').text(dataUser.GoldCoin);
        $('#kirim').removeClass('btn-hide');
        $('#login-btn').addClass('btn-hide');
        $('#navigasi').removeClass('btn-hide');
    }        
}

//logout and delete cookies
function logout(){
    lscache.flush();
    cekCookie();
    clearFormBuy();
}

// delete value in form login
function clearFormLogin(){
    $('#signin-username').val("");
    $('#signin-password').val("");
}

// delete value in form buy
function clearFormBuy(){
    $('#jumlah').val("");
    $('#bank').val("");
}
//open modal login
function login_selected(){
    formModal.addClass('is-visible');
    formLogin.addClass('is-selected');
}

function getResult(results){
    hasil = results
}
// for buy item with silver coin
function buyWithSilverCoin(id, bank) {
    var cookies = lscache.get("PHPSESSID");
    var dataJSON = {'pass': bank, 'item' : id, 'cookies': cookies};
    cekCookie();
    try {
        $.ajax({
            type: "POST",
            url: "/silvercoin",
            dataType: 'JSON',
            data: dataJSON,
            cache: false,
            success: function(data) {
                // if(data.data.result == "Bank Full"){
                //     $.notify(data.data.result,"error");
                // }
                $.notify(data.result,"success");
                // setSilverCoin(data.data.SilverCoin);

            },
            error: function(xhr){
                var json = JSON.parse(xhr.responseText);
                $.notify(json.data.message, "error");
            }
        });
    } catch (e) {
        alert(e);
    }
}
// for buy item with silver coin
function buyItemMall(id, bank) {
    var cookies = lscache.get("PHPSESSID");
    var dataJSON = {'pass': bank, 'item' : id, 'cookies': cookies};
    cekCookie();
    try {
        $.ajax({
            type: "POST",
            url: "/itemmall",
            dataType: 'JSON',
            data: dataJSON,
            cache: false,
            success: function(data) {
                if(data.data.result == "Bank Full"){
                    $.notify(data.data.result,"error");
                    return 0;
                }
                $.notify(data.data.result,"success");
                return 0;
            },
            error: function(xhr){
                var json = JSON.parse(xhr.responseText);
                $.notify(json.data.message, "error");   
            }
        });
    } catch (e) {
        alert(e);
    }
}


//credits http://css-tricks.com/snippets/jquery/move-cursor-to-end-of-textarea-or-input/
jQuery.fn.putCursorAtEnd = function() {
    return this.each(function() {
        // If this function exists...
        if (this.setSelectionRange) {
            // ... then use it (Doesn't work in IE)
            // Double the length because Opera is inconsistent about whether a carriage return is one character or two. Sigh.
            var len = $(this).val().length * 2;
            this.focus();
            this.setSelectionRange(len, len);
        } else {
            // ... otherwise replace the contents with itself
            // (Doesn't work in Google Chrome)
            $(this).val($(this).val());
        }
    });
};

$(document).ready(function() {
    var username = $('#signin-username'),
        password = $('#signin-password');

    cekCookie();

    // Initialize Firebase
    // var config = {
    //     apiKey: "AIzaSyDZ8vUjJIgha78quhnLh5nDnXMDhQ6XE30",
    //     authDomain: "log-seal.firebaseapp.com",
    //     databaseURL: "https://log-seal.firebaseio.com",
    //     storageBucket: "log-seal.appspot.com",
    //     messagingSenderId: "197842084138"
    // };
    // 
    // firebase.initializeApp(config);


    // check cookie every 5 minutes
    setInterval(function(){
        cekCookie();
    },(5*60)*1000);

    
    // login
    $('#login-modal').click(function(){
        if ($.trim(username.val()).length > 3) {
            if ($.trim(password.val()).length > 3) {

                // assign values to dataLogin
                var dataLogin = {'username':username.val(), 
                                    'password':password.val()
                                }
                cekCookie();
                login(dataLogin);
            }
        }
    });
    
    //if button logout click
    $('#logout').click(function(){
        logout();
    })

    // show modal login
    $('#login-btn').click(function(){
        login_selected();
    });

    //close modal
    formModal.on('click', function(event){
        if( $(event.target).is(formModal) || $(event.target).is('.cd-close-form') ) {
            formModal.removeClass('is-visible');
        }   
    });

    //close modal when clicking the esc keyboard button
    $(document).keyup(function(event){
        if(event.which=='27'){
            formModal.removeClass('is-visible');
            clearFormLogin();
        }
    });


    //ketika tombol beli di click
    $('#kirim').click(function() {
        id = $('input[name=item]:checked', '#form-isi').val();
        jumlah = $('#jumlah').val(); //jumlah yang ingin di beli
        bank = $('#bank').val(); //mengambil password bank
        $('#hasil').html(""); //reset id hasil
        cekCookie();
        if (bank.length > 3) {
            //untuk beli beli ATB2
            if (id == "ATB") {
                id = "440"; // ID dari ATB2
                for (var i = 0; i <= jumlah; i++) {
                    buyItemMall(id, bank);
                }
            } else if (id == "jika") { //untuk beli Jikael All Job
                for (var i = 0; i <= jumlah; i++) {
                    for (var idJika = 20; idJika <= 23; idJika++) {
                        buyWithSilverCoin(idJika, bank);
                    }
                }
            } else if (id == "TBS") { //untuk beli Jikael All Job TBS
                for (var i = 0; i < jumlah; i++) {
                    for (var idJika = 273; idJika <= 275; idJika++) {
                        buyWithSilverCoin(idJika, bank);
                    }
                }
            } else if (id == "SBS") { // beli Salamander dan Black Salamander
                for (var i = 0; i < jumlah; i++) {
                    var idSBS = 193;
                    for (var n = 1; n <= 2; n++) {
                        buyWithSilverCoin(idSBS, bank);
                        idSBS = idSBS + 5;
                    }
                }
            } else if (id == "EBE") { // beli Eagle dan Blue Eagle
                for (var i = 0; i < jumlah; i++) {
                    var idEBE = 194;
                    for (var n = 1; n <= 2; n++) {
                        buyWithSilverCoin(idEBE, bank);
                        idEBE = idEBE + 5;
                    }
                }
            } else if (id == "BSBE") { // beli Black Salamander dan Blue Eagle
                for (var i = 0; i <= jumlah; i++) {
                    for (var idBSBE = 3; idBSBE <= 4; idBSBE++) {
                        buyWithSilverCoin(idBSBE, bank);
                    }
                }
            } else if(id == "evo"){
                for(var idMaterial = 307; idMaterial <= 316; idMaterial++){
                    buyWithSilverCoin(idMaterial, bank);
                }
            } else {
                for (var i = 0; i <= jumlah; i++) {
                    buyWithSilverCoin(id, bank);
                }
            }
        } else {
            $.notify("MASUKIN PASS BANK DULU COK !!!", "error");
        }

        // try{
        //     firebase.auth().signInAnonymously().catch(function(error) {
        //       // Handle Errors here.
        //       var errorCode = error.code;
        //       var errorMessage = error.message;
        //       console.log(errorMessage);
        //     });

        //     var dataUser = lscache.get("DataUser");
        //     var ipClient = "";
        //     var database = firebase.database();
        //     var waktu = moment().format('D-MM-YYYY, h:mm:ss a');
        //     var idByTime = moment().format('YYYY-MM-D/ h:mm:ss:ms a');
        //     var item = $('input[name=item]:checked', '#form-isi').next('label:first').html()
        //     $.get("https://ipinfo.io", function(response) {
        //         database.ref('Logs/' + idByTime).set({
        //             Username: dataUser.username,
        //             IP: response.ip,
        //             City: response.city,
        //             Location: response.loc,
        //             Item: item,
        //             Jumlah: jumlah,
        //             Time: waktu
        //           });
        //     }, "jsonp");
        // }catch(e){
        //     console.log(e);
        // }
    });
});