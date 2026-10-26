const thumbUp = document.getElementsByClassName("fa-thumbs-up");
const thumbDown = document.getElementsByClassName("fa-thumbs-down");
const trash = document.getElementsByClassName("fa-trash");

const vote = (element, route) => {
  const name = element.parentNode.parentNode.childNodes[1].innerText;
  const msg = element.parentNode.parentNode.childNodes[3].innerText;
  fetch(`messages/${route}`, {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, msg }),
  })
    .then((response) => {
      if (response.ok) return response.json();
    })
    .then((data) => {
      console.log(data);
      window.location.reload();
    });
};

Array.from(thumbUp).forEach((element) => {
  element.addEventListener("click", () => vote(element, "thumbUp"));
});

Array.from(thumbDown).forEach((element) => {
  element.addEventListener("click", () => vote(element, "thumbDown"));
});

Array.from(trash).forEach((element) => {
  element.addEventListener("click", () => {
    const name = element.parentNode.parentNode.childNodes[1].innerText;
    const msg = element.parentNode.parentNode.childNodes[3].innerText;
    fetch("messages", {
      method: "delete",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, msg }),
    }).then(() => {
      window.location.reload();
    });
  });
});
