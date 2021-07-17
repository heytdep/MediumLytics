window.all_time_earnings = []


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function editearnBody() {
    document.getElementById('allTimeEarnings').removeAttribute('class')
    document.getElementById('allTimeEarnings').textContent = numberWithCommas(window.earns / 100) + "$"
}

function getAllStoriesReq() {
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
        .then(result => {
            let data = JSON.parse(result.slice(16)).payload.value

            console.log('parsing')
            let all_stories = []

            for (let i=0; i<data.length; i++) {
                all_stories.push(data[i].postId)
            }


            window.all_stories = all_stories
            window.all_time_earn = []

            document.getElementById('n_stories').removeAttribute('class')
            document.getElementById('n_stories').textContent = all_stories.length

            for (let k=0; k<window.all_stories.length; k++) {
                getEarningsReq(window.all_stories[k], k)
            }
            const bar = () => editearnBody()


            setTimeout(bar, all_stories.length*100)


        })
        .catch(error => console.log('error', error));


}



function getEarningsReq(postID, k) {
    var myHeaders = new Headers();
    myHeaders.append("Host", "medium.com");
    myHeaders.append("Cookie", `uid=${window.uid}; sid=${window.sid}; xsrf=${window.xsrf};`);
    myHeaders.append("Apollographql-Client-Name", "lite");
    myHeaders.append("Medium-Frontend-Route", "stats-post");
    myHeaders.append("Ot-Tracer-Sampled", "true");
    myHeaders.append("Graphql-Operation", "StatsPostChart");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Accept", "*/*");
    myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
    myHeaders.append("Sec-Gpc", "1");
    myHeaders.append("Origin", "https://medium.com");
    myHeaders.append("Sec-Fetch-Site", "same-origin");
    myHeaders.append("Sec-Fetch-Mode", "cors");
    myHeaders.append("Sec-Fetch-Dest", "empty");
    myHeaders.append("Referer", "https://medium.com/me/stats/post/");
    myHeaders.append("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8");

    var raw = JSON.stringify({
        "operationName": "StatsPostChart",
        "variables": {
            "postId": postID,
            "startAt": 1124320000000,
            "endAt": Date.now()
        },
        "query": "query StatsPostChart($postId: ID!, $startAt: Long!, $endAt: Long!) {\n  post(id: $postId) {\n    id\n    ...StatsPostChart_dailyEarnings\n    __typename\n  }\n}\n\nfragment StatsPostChart_dailyEarnings on Post {\n  earnings {\n    dailyEarnings(startAt: $startAt, endAt: $endAt) {\n      amount\n      __typename\n    }\n    lastCommittedPeriodStartedAt\n    __typename\n  }\n  __typename\n  id\n}\n"
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://medium.com/_/graphql", requestOptions)
        .then(response => response.text())
        .then(result => {
            let data = JSON.parse(result).data.post.earnings.dailyEarnings
            let story_earnings = []

            for (let i=0; i<data.length; i++) {
                story_earnings.push(data[i].amount)
            }

            if (story_earnings.length > 0) {
                window.all_time_earn.push(story_earnings.reduce((a,b) => (a+b)))
                window.earns = window.all_time_earn.reduce((a,b)=>(a+b))

            }


        })
        .catch(error => console.log('error', error));
}


getAllStoriesReq()


