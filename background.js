window.sid = ''
window.uid = ''
window.xsrf = ''

function getCookies() {
    chrome.cookies.get({ url: 'https://medium.com/me/stats', name: 'sid' },
        function (cookie) {
            if (cookie) {
                window.sid = cookie.value
            }
            else {
                alert('Can\'t get cookie! Check the name!');
            }
        });

    chrome.cookies.get({ url: 'https://medium.com/me/stats', name: 'uid' },
        function (cookie) {
            if (cookie) {
                window.uid = cookie.value
            }
            else {
                alert('Can\'t get cookie! Check the name!');
            }
        });

    chrome.cookies.get({ url: 'https://medium.com/me/stats', name: 'xsrf' },
        function (cookie) {
            if (cookie) {
                window.xsrf = cookie.value
            }
            else {
                alert('Can\'t get cookie! Check the name!');
            }
        });

}

getCookies()

