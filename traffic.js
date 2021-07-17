window.all_time_earnings = []
const all_traffics = []


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function test() {
    for (let s=0; s<window.all_stories.length; s++) {
        geTrafficReq(window.all_stories[s])
    }
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function output(inp) {
    document.getElementById('trafficJSON').innerHTML = inp;
}

function mergeNames (arr) {
    return _.chain(arr).groupBy('name').mapValues(function (v) {
        return _.chain(v).pluck('value').flattenDeep();
    }).value();
}


function concatenateObjects() {
    let allObjs = window.all_traffic
    const map = new Map(allObjs.map(({name, value}) => [name, { name, value: [] }]));
    for (let {name, value} of allObjs) map.get(name).value.push(...[value].flat());
    let all_traffics = [...map.values()]

    all_traffics.forEach(obj => obj.value = obj.value.reduce((a,b) => (a+b)))

    console.log(all_traffics)
    editTrafficBody(all_traffics)

}

function editTrafficBody(data) {
    data.sort(function(a, b){
        return b.value - a.value;
    })
    document.getElementById('dropdown').removeAttribute('class')
    for (let i=0; i<data.length;i++) {
        let p = document.createElement('p')
        p.innerHTML = data[i].name + " \u279C " + data[i].value.toString().bold()
        document.getElementById('dropdown').appendChild(p)
    }
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

            let all_stories = []

            for (let i=0; i<data.length; i++) {
                all_stories.push(data[i].postId)
            }

            window.all_stories = all_stories
            setTimeout(test, window.all_stories.length*10)
            setTimeout(concatenateObjects, window.all_stories.length*100)


        })
        .catch(error => console.log('error', error));
}



function geTrafficReq(postID) {
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
        "operationName": "StatsPostReferrersContainer",
        "variables": {
            "postId": postID
        },
        "query": "query StatsPostReferrersContainer($postId: ID!) {\n  post(id: $postId) {\n    id\n    ...StatsPostReferrersExternalRow_post\n    referrers {\n      ...StatsPostReferrersContainer_referrers\n      __typename\n    }\n    totalStats {\n      views\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment StatsPostReferrersExternalRow_post on Post {\n  title\n  __typename\n  id\n}\n\nfragment StatsPostReferrersContainer_referrers on Referrer {\n  postId\n  sourceIdentifier\n  totalCount\n  type\n  internal {\n    postId\n    collectionId\n    profileId\n    type\n    __typename\n  }\n  search {\n    domain\n    keywords\n    __typename\n  }\n  site {\n    href\n    title\n    __typename\n  }\n  platform\n  __typename\n}\n"
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
            let data = JSON.parse(result).data.post.referrers



            let trafficObj;
            for (let i = 0; i < data.length; i++) {
                let source = data[i].sourceIdentifier
                let count = data[i].totalCount

                trafficObj = {
                    "name": source,
                    "value": count
                }
                all_traffics.push(trafficObj)
                window.all_traffic = all_traffics
            }

            window.all_stories = all_stories


        })
        .catch(error => console.log('error', error));
}


getAllStoriesReq()



