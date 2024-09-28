const crypto = require("crypto");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

const clientCode = "210bc6d5dfa947a4b7bc1ae3ccdf385f";
const code = undefined;

async function handleAuth() {
  if (code) {
    redirectToAuthCodeFlow(clientCode);
  } else {
    try {
      const accessToken = await getAccessToken(clientId, code);
      //!: Need to find out what clientID is or if it's the same as clientCode
      const profile = await fetchProfile(accessToken);
      //*: profile is in json
      populateUI(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }
}

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  //TODO: Find out what 'URLSearchParams' is
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  //   document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  // TODO: Find out what this is and what it's trying to do
}

function generateCodeVerifier(length) {
  // Creates a random string for code Verifier
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash("sha256");
  hash.update(codeVerifier);
  const digest = hash.digest();
  return digest
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  const { access_token } = await result.json();
  return access_token;
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  return await result.json();
}

function populateUI(profile) {
  // TODO: to adjust to App.js html class names
  //   document.getElementById("displayName").innerText = profile.display_name;
  //   if (profile.images[0]) {
  //     const profileImage = new Image(200, 200);
  //     profileImage.src = profile.images[0].url;
  //     document.getElementById("avatar").appendChild(profileImage);
  //     document.getElementById("imgUrl").innerText = profile.images[0].url;
  //   }
  //   document.getElementById("id").innerText = profile.id;
  //   document.getElementById("email").innerText = profile.email;
  //   document.getElementById("uri").innerText = profile.uri;
  //   document
  //     .getElementById("uri")
  //     .setAttribute("href", profile.external_urls.spotify);
  //   document.getElementById("url").innerText = profile.href;
  //   document.getElementById("url").setAttribute("href", profile.href);
}

console.log("working");
handleAuth();
console.log("done");
