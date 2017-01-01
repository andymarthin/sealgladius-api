$(document).ready(function() {
    var username = $('#signin-username'),
        password = $('#signin-password');

    //cekCookie();

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
    // setInterval(function(){
    //     cekCookie();
    // },(5*60)*1000);

    
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
    // $('#logout').click(function(){
    //     logout();
    // })

    // show modal login
    // $('#login-btn').click(function(){
    //     login_selected();
    // });

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
        //cekCookie();
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
                for (var i = 1; i < jumlah; i++) {
                    var idSBS = 193;
                    for (var n = 1; n <= 2; n++) {
                        buyWithSilverCoin(idSBS, bank);
                        idSBS = idSBS + 5;
                    }
                }
            } else if (id == "EBE") { // beli Eagle dan Blue Eagle
                for (var i = 1; i < jumlah; i++) {
                    var idEBE = 194;
                    for (var n = 1; n <= 2; n++) {
                        buyWithSilverCoin(idEBE, bank);
                        idEBE = idEBE + 5;
                    }
                }
            } else if (id == "BSBE") { // beli Black Salamander dan Blue Eagle
                for (var i = 1; i <= jumlah; i++) {
                    for (var idBSBE = 3; idBSBE <= 4; idBSBE++) {
                        buyWithSilverCoin(idBSBE, bank);
                    }
                }
            } else if(id == "evo"){
                for(var idMaterial = 307; idMaterial <= 316; idMaterial++){
                    buyWithSilverCoin(idMaterial, bank);
                }
            } else {
                for (var i = 1; i <= jumlah; i++) {
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