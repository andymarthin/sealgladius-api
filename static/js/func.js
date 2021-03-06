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
