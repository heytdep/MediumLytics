function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function roundNum(number, precision = 1) {
    return Math.round(number / precision) * precision;
}

var myHeaders = new Headers();
myHeaders.append("Host", "medium.com");
myHeaders.append("Cookie", `uid=${window.uid}; sid=${window.sid}; xsrf=${window.xsrf};`);
myHeaders.append("Accept", "application/json");
myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
myHeaders.append("Sec-Gpc", "1");
myHeaders.append("Sec-Fetch-Site", "none");
myHeaders.append("Sec-Fetch-Mode", "cors");
myHeaders.append("Sec-Fetch-Dest", "empty");
myHeaders.append("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

fetch("https://medium.com/me/stats?limit=1000000", requestOptions)
    .then(response => response.text())
    .then(result => heyresponse(result))
    .catch(error => console.log('error', error));


function heyresponse(resp) {
    let data = JSON.parse(resp.slice(16)).payload.value

    all_views = []

    for (let i=0; i < data.length; i++) {
        all_views.push(data[i].views)
    }

    all_reads = []

    for (let i=0; i < data.length; i++) {
        all_reads.push(data[i].reads)
    }

    let allViews = numberWithCommas(all_views.reduce((a, b) => (a+b)))
    let allReads = numberWithCommas(all_reads.reduce((a, b) => (a+b)))

    document.getElementById('n_views').removeAttribute('class')
    document.getElementById('n_views').textContent = allViews
    document.getElementById('n_reads').removeAttribute('class')
    document.getElementById('n_reads').textContent = allReads
    document.getElementById('perc_reads').textContent = roundNum((parseFloat(allReads) * 100) / parseFloat(allViews)) + "%"
}
