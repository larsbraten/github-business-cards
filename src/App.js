import "./App.css";
import "./style.css";
import React from "react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

function App() {
  return (
    <div className="App">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Github Profiles</title>
        <link rel="stylesheet" href="style.css" />
      </head>
      <body>
        <form id="form">
          <input type="text" id="search" placeholder="Search a Github User" />
        </form>
        <main id="main">
          <div class="card">
            <div>
              <img
                class="avatar"
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              />
            </div>
            <div class="user-info">
              <h2>Username</h2>
              <p>Bio</p>
              <ul class="info">
                <li>
                  Followers<strong>Followers</strong>
                </li>
                <li>
                  Following<strong>Following</strong>
                </li>
                <li>
                  Repos<strong>Repos</strong>
                </li>
              </ul>
              <div id="repos"></div>
            </div>
          </div>
        </main>
        <button class="button" onClick={downloadBusinessCard}>
          Download Card
        </button>
      </body>
    </div>
  );
  function downloadBusinessCard() {
    htmlToImage.toPng(document.getElementById("main")).then(function (dataUrl) {
      download(dataUrl, "my-node.png");
    });
  }
}

window.onload = () => {
  const APIURL = "https://api.github.com/users/";

  const main = document.getElementById("main");
  const form = document.getElementById("form");
  const search = document.getElementById("search");

  async function getUser(username) {
    const resp = await fetch(APIURL + username);
    const respData = await resp.json();

    createUserCard(respData);

    getRepos(username);
  }

  async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
  }

  function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <p>${user.bio}</p>
                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>
                <div id="repos"></div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
  }

  function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 10)
      .forEach((repo) => {
        const repoEl = document.createElement("a");
        repoEl.classList.add("repo");

        repoEl.href = repo.html_url;
        repoEl.target = "_blank";
        repoEl.innerText = repo.name;

        reposEl.appendChild(repoEl);
      });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
      getUser(user);

      search.value = "";
    }
  });
};

export default App;
