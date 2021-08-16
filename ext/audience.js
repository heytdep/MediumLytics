function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function count(obj) { return Object.keys(obj).length; }

function showUsualFans() {
    var button = document.getElementById("viewFansBtn")
    document.getElementById("viewFansText").style.display = 'none'

    button.addEventListener("click", (e) => {
        console.log(document.getElementById("viewFansText").style.display)
        if (document.getElementById("viewFansText").style.display === "none") {
            document.getElementById("viewFansText").style.display = 'inline'
            button.innerText = "Show Less"
        }

        else {
            document.getElementById("viewFansText").style.display = 'none'
            button.innerText = "Who?"
        }
    })

}

function countInArray(array, what) {
    return array.filter(item => item == what).length;
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

fetch("https://medium.com/_/api/activity?limit=100000000000", requestOptions)
    .then(response => response.text())
    .then(result => heyresponse(result))
    .catch(error => console.log('error', error));


function heyresponse(resp) {
    let data = JSON.parse(resp.slice(16)).payload.value
    let all_rollups = count(data)

    let all_followers = []
    let all_fans = []
    let all_fans_id = []


    for (let i=0; i<all_rollups; i++) {
        if (data[i].activityType === "users_following_you_rollup") {
            let rollupItems = data[i].rollupItems
            for (let i_r=0; i_r<rollupItems.length; i_r++) {
                let followerObj = {
                    "userID": rollupItems[i_r].actorId,
                    "occurredAt": rollupItems[i_r].occurredAt,
                    "memeberAt": rollupItems[i_r].mediumMemberAt,
                }
                all_followers.push(followerObj)
            }
        }
        if (data[i].activityType === "post_recommended_rollup") {
            let rollupItems = data[i].rollupItems
            for (let i_r=0; i_r<rollupItems.length; i_r++) {
                let fanObj = {
                    "userID": rollupItems[i_r].actorId,
                    "occurredAt": rollupItems[i_r].occurredAt,
                    "memeberAt": rollupItems[i_r].mediumMemberAt,
                }
                all_fans.push(fanObj)
                all_fans_id.push(rollupItems[i_r].actorId)
            }
        }

        if (data[i].activityType === "post_recommended") {
            let fanObj = {
                "userID": data[i].actorId,
                "occurredAt": data[i].occurredAt,
                "memberAt": data[i].mediumMemberAt,
            }
            all_fans.push(fanObj)
            all_fans_id.push(data[i].actorId)
        }

        if (data[i].activityType === "users_following_you") {
            let followerObj = {
                "userID": data[i].actorId,
                "occurredAt": data[i].occurredAt,
                "memberAt": data[i].mediumMemberAt,
            }
            all_followers.push(followerObj)
        }

    }


    let all_member_fans = []

    for (let f=0; f<all_fans.length; f++) {
        let usrobj = JSON.parse(resp.slice(16)).payload.references.User[all_fans[f].userID]
        console.log(all_fans[f].userID)
        console.log(f)
        console.log(usrobj)
        try {
            let f_mat = usrobj.mediumMemberAt
            if (f_mat !== 0) {
                all_member_fans.push(f_mat)
            }
        }
        catch (e) {
            console.log(`user not found ${usrobj}`)
        }
    }


    const last_updated_at = new Date(all_fans[all_fans.length-1].occurredAt)
    document.getElementById("last_updated").textContent = "Last Update at: " + last_updated_at

    const filtered = all_fans_id.filter((v, i) => all_fans_id.indexOf(v) !== i)
    const unique = new Set(filtered)

    let all_usual_fans = []

    for (let j=0; j<Array.from(unique).length; j++) {
        all_usual_fans.push(JSON.parse(resp.slice(16)).payload.references.User[Array.from(unique)[j]].username)
    }

    let parsed = "";
    for (let k = 0; k < all_usual_fans.length; k++) {
        parsed += "\n\n" + all_usual_fans[k] + "\n\n"
    }

    console.log(all_fans)

    document.getElementById('n_usual_fans').removeAttribute('class')
    document.getElementById('viewFansBtn').removeAttribute('class')
    document.getElementById('viewFansBtn').style.backgroundColor = '#64865c'
    document.getElementById('n_followers').removeAttribute('class')
    document.getElementById('n_member_fans').removeAttribute('class')
    document.getElementById('n_all_fans').removeAttribute('class')
    document.getElementById('n_all_fans').textContent = all_fans.length
    document.getElementById('perc_member_fans').textContent = roundNum((all_member_fans.length / all_fans.length) * 100) + "%"
    document.getElementById('n_member_fans').textContent = all_member_fans.length
    document.getElementById('n_followers').innerText = all_followers.length
    document.getElementById('viewFansBtn').innerText="Who?"
    document.getElementById('n_usual_fans').textContent = Array.from(unique).length
    document.getElementById('viewFansText').textContent = parsed

}

showUsualFans()
