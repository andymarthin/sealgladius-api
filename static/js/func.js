var id = '',
    jumlah = '',
    bank = '',
    formModal = $('.cd-user-modal'),
    formLogin = formModal.find('#cd-login');

// logiin to http://seal-gladius.com/
    function login(dataLogin) {
        $.ajax({
        type: "POST",
        url: "/login",
        dataType: 'JSON',
        data: dataLogin,
        cache: false,
        success: function(data) {
            var DataUser = {'username': data.data.Username,
                 'SilverCoin': data.data.SilverCoin,
                 'GoldCoin': data.data.GoldCoin
                };

            lscache.set("PHPSESSID", data.data.cookies.PHPSESSID, 90);
            lscache.set("DataUser",  JSON.stringify(DataUser),90);

            formModal.removeClass('is-visible');
            cekCookie();
            $('#username').text(data.data.Username);
            $('#kirim').removeClass('btn-hide');
            $('#login-btn').addClass('btn-hide');
        },
        error: function(xhr){
            var json = JSON.parse(xhr.responseText);
            $.notify(json.data.message, "error");
        }
    });
    }

    //set cookies
    function setSilverCoin(coin){
        var dataUser = lscache.get("DataUser");
        var DataCoin = {'username': dataUser.Username,
             'SilverCoin': coin,
             'GoldCoin': dataUser.GoldCoin
            };
        var curent_time = Math.floor((new Date().getTime())/( 60 * 1000));
        var dataUserExpire = lscache.get("DataUser-cacheexpiration");
        var newtime = dataUserExpire - curent_time;
        console.log(newtime);
        lscache.remove("DataUser");
        lscache.set("DataUser", JSON.stringify(DataCoin),newtime);
        $('#SilverCoin').text(coin);
    }

    //checking cookies
    function cekCookie(){
        var cekCookies = lscache.get("PHPSESSID");
        lscache.flushExpired();
        if (cekCookies === null) {
            login_selected();
            $('#login-btn').removeClass('btn-hide');
            $('#kirim').addClass('btn-hide');
            $('#navigasi').addClass('btn-hide');
        }else{
            var dataUser = lscache.get("DataUser");
            $('#username').text(dataUser.username);
            $('#SilverCoin').text(dataUser.SilverCoin);
            $('#GoldCoin').text(dataUser.GoldCoin);
            $('#kirim').removeClass('btn-hide');
            $('#login-btn').addClass('btn-hide');
            $('#navigasi').removeClass('btn-hide');
        }        
    }

    //logout and delete cookies
    function logout(){
        lscache.flush();
        $('#username').text("");
        cekCookie();
        $('#signin-username').val("");
        $('#signin-password').val("");
    }

    //open modal login
    function login_selected(){
        formModal.addClass('is-visible');
        formLogin.addClass('is-selected');
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
                    if(data.data.result == "Bank Full"){
                        $.notify(data.data.result,"error");
                        return "";
                    }
                    $.notify(data.data.result,"success");
                    setSilverCoin(data.data.SilverCoin);
                    return "";
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
                    return "";
                }
                $.notify(data.data.result,"success");
                return "";
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
