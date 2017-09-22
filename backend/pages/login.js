module.exports = {};

module.exports.GET = async function(req, serve, vars, params) {
    var template_data = vars.template_data;
    var cookies = vars.cookies;
    var db = vars.db;
    var user = vars.user;
    var new_token = vars.new_token;

    var data = {
        user_is_authenticated: user.authenticated,
        user: user.username,
        form_errors: params.errors, // "Your username and password didn't match. Please try again."
        csrftoken: new_token(32)
    };

    serve(template_data["registration/login.html"](data))
}

module.exports.POST = async function(req, serve, vars, params) {
    var cookies = vars.cookies;
    var db = vars.db;
    var user = vars.user;
    var post_data = vars.post_data;
    var checkHash = vars.checkHash;
    var new_token = vars.new_token;
    var cookie_expire = vars.cookie_expire;
    var ms = vars.ms;
    var querystring = vars.querystring;
    var referer = vars.referer;
    var url = vars.url;
    var dispage = vars.dispage;

    var username = post_data.username;
    var password = post_data.password;
    if(params.registered) {
        username = params.username;
        password = params.password;
    }

    var user = await db.get("SELECT * FROM auth_user WHERE username=? COLLATE NOCASE", username)
    if(!user) {
        await dispage("login", {errors: true}, req, serve, vars)
    }
    var valid = checkHash(user.password, password)
    if(!valid) { // wrong password
        await dispage("login", {errors: true}, req, serve, vars)
    }

    var date_now = Date.now();
    var expires = date_now + ms.Month;

    var sessionid = new_token(32);
    var new_cookie = "sessionid=" + sessionid + "; expires=" +
        cookie_expire(expires) + "; path=/;";

    var data = {
        type: "sessionid_auth",
        date: date_now,
        csrftoken: cookies.csrftoken,
        id: user.id,
        username: user.username
    }

    await db.run("INSERT INTO auth_session VALUES(?, ?, ?)", [sessionid, JSON.stringify(data), expires])
    await db.run("UPDATE auth_user SET last_login=? WHERE id=?", [date_now, user.id])

    var next = "/accounts/profile/";
    var check_next = querystring.parse(url.parse(referer).query)
    if(check_next.next) {
        next = check_next.next;
    }

    serve(null, null, {
        cookie: new_cookie,
        redirect: next
    })
}