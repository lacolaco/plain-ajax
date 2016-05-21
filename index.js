class XhrWrapper {
    static sendAsync(xhr) {
        return new Promise((resolve, reject) => {
            xhr.addEventListener('load', (evt) => {
                resolve(evt.target.response);
            }, false);
            xhr.addEventListener('error', (evt) => {
                reject(evt.target.error);
            }, false);
            xhr.send();
        });
    }
}

class UserInfo {
    constructor(data) {
        this.name = data.name;
        this.avatar_url = data.avatar_url;
        this.location = data.location;
        this.public_repos = data.public_repos;
        this.login = data.login;
    }
}

function fetchInfo() {
    const userId = document.getElementById('userId').value;
    if (!userId.trim()) {
        return;
    }
    const req = new XMLHttpRequest();
    req.open('GET', `https://api.github.com/users/${userId}`);
    XhrWrapper.sendAsync(req)
        .then(response => JSON.parse(response))
        .then(data => new UserInfo(data))
        .then(userInfo => buildUserInfoView(userInfo))
        .then(view => {
            renderUserInfoView(view);
        })
        .catch(error => {
            console.error(error);
        });
}

function renderUserInfoView(view) {
    const target = document.getElementById('result');
    target.innerHTML = null;
    target.appendChild(view);
}

function buildUserInfoView(userInfo) {
    const view = document.createElement('div');
    view.innerHTML = `
    <h4>${userInfo.name} (@${userInfo.login})</h4>
    <img src="${userInfo.avatar_url}" alt="${userInfo.login}" height="100"></img>
    <dl>
        <dt>Location</dt>
        <dd>${userInfo.location}</dd>
        <dt>Repositries</dt>
        <dd>${userInfo.public_repos}</dd>
    </dl>
    `;
    return view;
}