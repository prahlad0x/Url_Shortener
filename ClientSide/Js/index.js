let urlInp = document.getElementById("urlInp");
const token = localStorage.getItem("token");
let dataDiv = document.getElementById("data");
const loader = document.querySelector(".loaderDiv");
const searchesDiv = document.querySelector(".searches");
const toast = document.getElementById("snackbar");

let RecentData = [];

if (!token) {
  swal("Login Required!", { icon: "warning" }).then((res) => {
    window.location.href = "./login/loginSignup.html";
  });
} else {
  verify();
}

function showData() {
  RecentData.sort((a, b) => new Date(b.time) - new Date(a.time));

  let html = `${RecentData.map((el) => getCard(el)).join("")}`;

  searchesDiv.innerHTML = html;

  let copybtns = document.querySelectorAll(".copyBtn");

  for (let btn of copybtns) {
    btn.addEventListener("click", (e) => {
      const linkToCopy = e.target.dataset.id;

      navigator.clipboard
        .writeText(linkToCopy)
        .then((res) => {
          showToast("#08808b", "✓ Copied to clipboard");

          btn.style.color = "#34d634";
          btn.innerText = "✓ Copied";

          setTimeout(() => {
            btn.style.color = "black";
            btn.innerText = "Copy";
          }, 800);
        })
        .catch((err) => {
          console.log(err);
          swal("Unable to Copy!", { icon: "info" });
        });
    });
  }
}

function getCard(data) {
  return `
        <div class="items">
            <div class="originalLink">${data.originalUrl}</div>
            <div class="newLinkDiv">
                <div><a target="_blank" href="https://pk-sh.onrender.com/${data.shortUrl}">pk-sh.onrender/${data.shortUrl}</a></div>
                <div><p id="${data._id}" class="copyBtn" data-id="https://pk-sh.onrender.com/${data.shortUrl}">Copy</p></div>
            </div>
    </div>
    `;
}

function getRecents() {
  loader.style.display = "flex";

  fetch(`https://pk-sh.onrender.com/api/url/recents`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk) {
        RecentData = [...RecentData, ...data.recent];
        showData();
      } else {
        swal(data.message, { icon: "info" });
      }
      loader.style.display = "none";
    })
    .catch((err) => {
      console.log(err);
      swal("someting went wrong!", { icon: "error" });
    });
}

function getUrl() {
  let url = urlInp.value;
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  if (!url) {
    showToast("#d00000", "Please enter a valid URL");
    urlInp.focus();
    return;
  }

  const isValid = urlRegex.test(url);
  if (!isValid) {
    showToast("#d00000", "Please enter a valid URL");
    return;
  }

  loader.style.display = "inline-block";
  document.querySelector(".loaderDiv p").style.display = "none";

  fetch(`https://pk-sh.onrender.com/api/url/shorten`, {
    method: "POST",
    body: JSON.stringify({ originalUrl: url }),
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.isOk) {
        showToast("#2a850e", "Shorten Successfully");
        addNewData(data.newUrl);
        showData();
        urlInp.value = "";
      } else {
        swal(data.message, { icon: "info" });
      }
      loader.style.display = "none";
      document.querySelector(".loaderDiv p").style.display = "flex";
    })
    .catch((err) => {
      console.log(err);
      loader.style.display = "none";
      document.querySelector(".loaderDiv p").style.display = "flex";
      swal("someting went wrong!", { icon: "error" });
    });
}

function addNewData(data) {
  RecentData = RecentData.filter((el) => el._id != data._id);
  RecentData = [data, ...RecentData];
}

function logout() {
  localStorage.clear();
  window.location.href = "./login/loginSignup.html";
}

function showToast(color, text) {
  toast.className = "show";
  toast.style.background = color;
  toast.innerText = text;
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 1500);
}
function verify() {
  fetch(`https://pk-sh.onrender.com/api/auth/verify`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.isOk || !data.Is_verified) {
        showToast("#eb5e28", "Login Required");
        setTimeout(() => {
          window.location.href = "./login/loginSignup.html";
        }, 1000);
      } else {
        getRecents();
      }
    })
    .catch((err) => {
      console.log(err);
      showToast("#eb5e28", "Login Required");
      setTimeout(() => {
        window.location.href = "./login/loginSignup.html";
      }, 1000);
    });
}

async function showHistory() {
  fetch(`https://pk-sh.onrender.com/api/url/getHistory`, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.isOk || !data.Is_verified) {
        console.log(data);
        showToast("#eb5e28", "Data");
      } else {
        showToast("#eb5e28", "Error");
      }
    })
    .catch((err) => {
      console.log(err);
      showToast("#eb5e28", "Kuch gadbad h re baba!");
    });
}
