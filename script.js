console.log("Script Loaded!");

let currentUserEmail = null;

//check the cart items and its count
function checkCart() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const loggedInUser = users.find((user) => user.loggedIn === true);

  const badgeElements = document.querySelectorAll(
    ".nav-cart-icon-badge, .nav-cart-icon-badge-mobile"
  );

  if (!loggedInUser || !loggedInUser.email) {
    badgeElements.forEach((badge) => {
      badge.textContent = "";
    });
    return;
  } else {
    const currentUserEmail = loggedInUser.email;

    const userCartItems = cart.filter((item) => item.user === currentUserEmail);

    badgeElements.forEach((badge) => {
      badge.textContent = userCartItems.length || "";
    });
  }
}

window.addEventListener("DOMContentLoaded", checkCart);

// NAVIGATION

//To Highlight the current page navbar
function navClick() {
  const navLinks = document.querySelectorAll(".nav-link");

  const currentPage = window.location.pathname.split("/").pop();

  console.log("currentPage: ", currentPage);

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
      link.classList.add("active", "fw-bold");
    } else {
      link.classList.remove("active", "fw-bold");
    }
  });
}

document.addEventListener("DOMContentLoaded", navClick);

//new arrival
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("newArrivalPdtList");
  const template = document.querySelector(".product-card-template");

  fetch("new-arrival-pdts.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        if (template) {
          const card = template.cloneNode(true);
          card.classList.remove("d-none");

          card.querySelector(
            ".product-link"
          ).href = `product-details.html?id=${product.id}`;
          card.querySelector(".product-img").src = product.img;
          card.querySelector(".product-img").alt = product.name;
          card.querySelector(".product-name").textContent = product.name;
          card.querySelector(".product-rating").textContent = product.rating;
          card.querySelector(".product-price-text").textContent = product.price;

          const favIcon = card.querySelector(".fav-icon");

          // Toggle the favorite status when clicked
          favIcon.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the link click

            favIcon.classList.toggle("fav-active");

            if (favIcon.classList.contains("fav-active")) {
              favIcon.src = "img/heart-fill.svg";
            } else {
              favIcon.src = "img/heart-outline.svg";
            }
          });

          container.appendChild(card);
        }
      });
    });
});

//top selling
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("topSellingPdts");
  const template = document.querySelector(".top-product-card-template");

  fetch("top-selling-pdts.json")
    .then((res) => res.json())
    .then((products) => {
      products.forEach((product) => {
        if (template) {
          const card = template.cloneNode(true);
          card.classList.remove("d-none");

          card.querySelector(
            ".top-product-link"
          ).href = `product-details.html?id=${product.id}`;
          card.querySelector(".top-product-img").src = product.img;
          card.querySelector(".top-product-img").alt = product.name;
          card.querySelector(".top-product-name").textContent = product.name;
          card.querySelector(".top-product-rating").textContent =
            product.rating;
          card.querySelector(".top-product-price-text").textContent =
            product.price;

          container.appendChild(card);
        }
      });
    });
});

//reviews
document.addEventListener("DOMContentLoaded", function () {
  const reviewBox = document.getElementById("reviews");
  const template = document.querySelector(".review-card-template");

  fetch("home-reviews.json")
    .then((res) => res.json())
    .then((reviewsList) => {
      reviewsList.forEach((rev) => {
        if (template) {
          const card = template.cloneNode(true);
          card.classList.remove("d-none", "review-card-template");

          card.querySelector(".reviewer-name").textContent = rev.name;
          card.querySelector(".review-text").textContent = rev.review;

          reviewBox.appendChild(card);
        }
      });
    });
});

//PDT DETAILS PAGE
const params = new URLSearchParams(window.location.search);
const productId = parseInt(params.get("id"));

fetch("pdt-details.json")
  .then((res) => res.json())
  .then((products) => {
    const product = products.find((p) => p.id === productId);

    let cart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!product) return;

    document.querySelector(".pdt-details-name").textContent = product.name;
    document.querySelector(".main-img img").src = product.img;
    document.querySelector(".main-img img").alt = product.name;
    document.querySelector(".pdt-details-rating").textContent = product.rating;
    document.querySelector(
      ".pdt-details-selling-price"
    ).textContent = `₹${product.sprice}`;
    document.querySelector(
      ".pdt-details-cost-price"
    ).textContent = `₹${product.cprice}`;
    document.querySelector(".pdt-details-desc").textContent =
      product.description;

    const sideImgContainer = document.querySelector(".side-img");
    product["other-imgs"].forEach((imgSrc, index) => {
      const img = document.createElement("img");
      img.src = imgSrc;
      img.className = `side-img-border mb-2 rounded-4 ${
        index === 0 ? "active border border-black" : ""
      }`;
      img.onclick = function () {
        imgSelection(this);
        imgBorderSelection();
      };
      sideImgContainer.appendChild(img);
    });

    imgBorderSelection(); // initial call for first image
  });

//pdt image and border selection
function imgSelection(sideImage) {
  var mainImg = document.getElementById("mainImg");
  mainImg.src = sideImage.src;
}

function imgBorderSelection() {
  const sideImgBorder = document.querySelectorAll(".side-img-border");

  sideImgBorder.forEach((link) => {
    link.addEventListener("click", function () {
      sideImgBorder.forEach((nav) =>
        nav.classList.remove("active", "border", "border-black")
      );

      this.classList.add("active", "border", "border-black");
    });
  });
}

//pdt size selection

let selectedSize = null;

function sizeSelection() {
  const btnClass = document.querySelectorAll(".size-btn");

  btnClass.forEach((link) => {
    link.addEventListener("click", function () {
      selectedSize = this.textContent.trim();

      btnClass.forEach((sel) => sel.classList.remove("default-selection"));

      this.classList.add("default-selection");
    });
  });

  const defaultSelectedBtn = document.querySelector(".default-selection");

  if (defaultSelectedBtn) {
    selectedSize = defaultSelectedBtn.textContent.trim();
  }
}

//to load the js initially
document.addEventListener("DOMContentLoaded", function () {
  sizeSelection();
});

//pdt details reviews
document.addEventListener("DOMContentLoaded", function () {
  const reviewContainer = document.getElementById("reviewContainer");

  const template = document.querySelector(".pdt-review-template");

  fetch("pdt-reviews.json")
    .then((res) => res.json())
    .then((pdtReviews) => {
      pdtReviews.forEach((rev) => {
        if (template) {
          const card = template.cloneNode(true);
          card.classList.remove("d-none");

          card.querySelector(".pdt-reviewer-name").textContent = rev.name;
          card.querySelector(".pdt-reviewer-review").textContent = rev.review;
          card.querySelector(".pdt-review-date").textContent = rev.date;

          reviewContainer.appendChild(card);
        }
      });
    });
});

//CART

//add to cart
function addToCart() {
  fetch("pdt-details.json")
    .then((res) => res.json())
    .then((products) => {
      const product = products.find((p) => p.id === productId);

      let cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingItem = cart.find((item) => {
        console.log("item.id:", item.id);
        console.log("productId:", productId);
        console.log("item.size:", item.size);
        console.log("selectedSize:", selectedSize);

        return item.id == productId && item.size === selectedSize;
      });

      if (existingItem) {
        existingItem.quantity += 1;
        document.getElementById("snackbar-content").textContent =
          "Already in your basket - adding one more!";
        document.querySelector(".snackbar-img").classList.add("d-none");
      } else {
        let users = JSON.parse(localStorage.getItem("users") || "[]");
        const loggedInUser = users.find((user) => user.loggedIn === true);

        currentUserEmail = loggedInUser.email;

        console.log("currentUserEmail:", currentUserEmail);

        const cartItem = {
          name: product.name,
          img: product.img,
          rating: product.rating,
          price: product.sprice,
          id: product.id,
          quantity: 1,
          size: selectedSize,
          user: currentUserEmail,
        };
        cart.push(cartItem);

        console.log(cart);
        document.getElementById(
          "snackbar-content"
        ).textContent = `${product.name} added to the cart.`;
        document.querySelector(".snackbar-img").classList.remove("d-none");
        document.querySelector(".snackbar-img").src = product.img;
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      console.log("Cart updated:", cart);

      checkCart();
    });
}

//get cart
document.addEventListener("DOMContentLoaded", function () {
  const cartItemsContainer = document.querySelector(".cart-items");
  const template = document.querySelector(".cart-item-template");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const users = JSON.parse(localStorage.getItem("users") || "[]");

  const loggedInUser = users.find((user) => user.loggedIn === true);

  document.querySelector(".nav-cart-icon-badge").textContent = cart.length;
  document.querySelector(".nav-cart-icon-badge-mobile").textContent =
    cart.length;

  const badgeElements = document.querySelectorAll(
    ".nav-cart-icon-badge, .nav-cart-icon-badge-mobile"
  );

  if (!loggedInUser || !loggedInUser.email) {
    badgeElements.forEach((badge) => {
      badge.textContent = "";
    });
    return;
  } else {
    const currentUserEmail = loggedInUser.email;

    const userCartItems = cart.filter((item) => item.user === currentUserEmail);

    badgeElements.forEach((badge) => {
      badge.textContent = userCartItems.length || "";
    });
    const summary = document.querySelector(".summary");

    if (summary) {
      if (userCartItems.length == 0) {
        document.querySelector(".summary").classList.add("d-none");
        document.querySelector(".cart-empty").classList.remove("d-none");
      } else {
        document.querySelector(".summary").classList.remove("d-none");
        document.querySelector(".cart-empty").classList.add("d-none");
        let subTotal = 0;
        userCartItems.forEach((item, index) => {
          const card = template.cloneNode(true);
          card.classList.remove("d-none");

          card.querySelector(".cart-item-img").src = item.img;
          card.querySelector(".cart-item-name").textContent = item.name;
          card.querySelector(".cart-item-price").textContent = `₹${item.price}`;
          card.querySelector(".cart-item-quantity").textContent = item.quantity;
          card.querySelector(".cart-item-size").textContent = item.size;

          subTotal += Number(item.price) * Number(item.quantity);

          console.log(subTotal);

          updateSummary(subTotal);

          const quantityDisplay = card.querySelector(".cart-item-quantity");
          const incrementBtn = card.querySelector(".incr");
          const decrementBtn = card.querySelector(".decr");

          incrementBtn.addEventListener("click", () => {
            item.quantity++;
            quantityDisplay.textContent = item.quantity;
            cart = updateCartItem(cart, item, currentUserEmail);
            localStorage.setItem("cart", JSON.stringify(cart));
            const updatedUserCartItems = cart.filter(
              (ci) => ci.user === currentUserEmail
            );

            let newSubTotal = 0;
            for (const item of updatedUserCartItems) {
              newSubTotal += Number(item.price) * Number(item.quantity);
            }
            //location.reload();
            updateSummary(newSubTotal);
          });

          decrementBtn.addEventListener("click", () => {
            if (item.quantity > 1) {
              item.quantity--;
              quantityDisplay.textContent = item.quantity;
              cart = updateCartItem(cart, item, currentUserEmail);
              localStorage.setItem("cart", JSON.stringify(cart));
              const updatedUserCartItems = cart.filter(
                (ci) => ci.user === currentUserEmail
              );

              let newSubTotal = 0;
              for (const item of updatedUserCartItems) {
                newSubTotal += Number(item.price) * Number(item.quantity);
              }
              //location.reload();
              updateSummary(newSubTotal);
            }
          });

          // delete cart item
          const removeBtn = card.querySelector(".fa-trash");
          removeBtn.addEventListener("click", () => {
            cart.splice(index, 1);
            localStorage.setItem("cart", JSON.stringify(cart));
            location.reload();
          });

          cartItemsContainer.appendChild(card);
        });
      }
    }
  }
});

function updateSummary(subTotal) {
  const delivery = 15;
  const total = subTotal + delivery;

  document.querySelector(".subTotal").textContent = `₹${subTotal}`;
  document.querySelector(".delivery").textContent = `₹${delivery}`;
  document.querySelector(".total-cost").textContent = `₹${total}`;
}

function updateCartItem(cart, updatedItem, user) {
  return cart.map((c) => {
    if (
      c.id === updatedItem.id &&
      c.size === updatedItem.size &&
      c.user === user
    ) {
      return { ...c, quantity: updatedItem.quantity };
    }
    return c;
  });
}

//update product quantity
let quantity = 1;

console.log(quantity);

document.addEventListener("DOMContentLoaded", function () {
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let item = cart.find((i) => i.id === productId);

  if (item) {
    quantity = item.quantity;
  } else {
    quantity = 1;
  }

  // const quantityDisplay = document.querySelector(".pdt-details-quantity");
  // const incrementBtn = document.getElementById("incr");
  // const decrementBtn = document.getElementById("decr");

  // incrementBtn.addEventListener("click", function () {
  //     console.log("Increment button clicked!");
  //     quantity++;
  //     console.log("Quantity after increment:", quantity);
  //     quantityDisplay.innerText = quantity;
  // });

  // decrementBtn.addEventListener("click", function () {
  //     console.log("Decrement button clicked!");
  //     if (quantity > 1) {
  //         quantity--;
  //         console.log("Quantity after decrement:", quantity);
  //         quantityDisplay.innerText = quantity;
  //     }
  // });
});

//CATEGORY PDTS
document.addEventListener("DOMContentLoaded", function () {
  const categoryPdtsContainer = document.getElementById("categoryPdts");
  const template = document.querySelector(".casual-pdts-template");

  fetch("category-casual-pdts.json")
    .then((res) => res.json())
    .then((casPdts) => {
      casPdts.forEach((pdt) => {
        if (template) {
          const card = template.cloneNode(true);

          //initialy remove the display and add the templates (my understanding)
          card.classList.remove("d-none");

          card.querySelector(
            ".casual-pdts-link"
          ).href = `product-details.html?id=${pdt.id}`;
          card.querySelector(".casual-pdts-img").src = pdt.img;
          card.querySelector(".casual-pdts-name").textContent = pdt.name;
          card.querySelector(".casual-pdts-rating").textContent = pdt.rating;
          card.querySelector(".casual-pdts-price").textContent = pdt.price;

          categoryPdtsContainer.appendChild(card);
        }
      });
    });
});

//Lib for swiping
if (window.location.pathname.split("/").pop() === "index.html") {
  document.addEventListener("DOMContentLoaded", function () {
    const swiper = new Swiper(".mySwiper", {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 20,
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        992: {
          slidesPerView: 4,
        },
      },
    });

    document
      .getElementById("swiper-prev")
      .addEventListener("click", function () {
        swiper.slidePrev();
      });

    document
      .getElementById("swiper-next")
      .addEventListener("click", function () {
        swiper.slideNext();
      });
  });
}

function snackBarAnimation() {
  return new Promise((resolve) => {
    console.log("On Clicking");
    const x = document.querySelector(".snackbar");
    x.classList.add("show");

    setTimeout(() => {
      x.classList.remove("show");
      resolve(); // Now this lets `.then()` work
    }, 3000);
  });
}

// Login Modal
// document.addEventListener("DOMContentLoaded", function (event) {
//   fetch("../html/login-modal.html")
//     .then((response) => response.text())
//     .then((html) => {
//       const loginModalContainer = document.getElementById(
//         "loginModalContainer"
//       );
//       if (loginModalContainer) {
//         loginModalContainer.innerHTML = html;
//         console.log(loginModalContainer);
//       }
//     });
// });

fetch("login-modal.html")
  .then((response) => response.text())
  .then((html) => {
    const loginModalContainer = document.getElementById("loginModalContainer");
    if (loginModalContainer) {
      loginModalContainer.innerHTML = html;
    } else {
      console.error("loginModalContainer not found in the DOM.");
    }
  })
  .catch((err) => console.error("Failed to load login modal:", err));

let isSignup = true;

function performAction() {
  if (isSignup) {
    console.log("Signing up");
    signupUser();
  } else {
    console.log("Logging in");
    loginUser();
  }
}

function switchForm() {
  const button = document.querySelector(".formBtn");
  const description = document.getElementById("switchFormDescription");
  const action = document.getElementById("switchFormAction");
  const formTitle = document.querySelector(".form-title");
  const formDesc = document.querySelector(".form-desc");
  const fNameForm = document.querySelector(".fNameForm");
  const lNameForm = document.querySelector(".lNameForm");
  console.log("ejdbehdehd");
  console.log(isSignup);
  if (isSignup) {
    // Go to LOGIN
    formTitle.textContent = "Login";
    formDesc.textContent = "Welcome back! Please enter your details.";
    description.textContent = "New User?";
    action.textContent = "Sign Up";
    button.textContent = "Login";
    fNameForm.classList.add("d-none");
    lNameForm.classList.add("d-none");
  } else {
    // Go to SIGNUP
    formTitle.textContent = "Sign Up";
    formDesc.textContent = "Create your account. It only takes a minute.";
    description.textContent = "Already have an account?";
    action.textContent = "Login";
    button.textContent = "Sign Up";
    fNameForm.classList.remove("d-none");
    lNameForm.classList.remove("d-none");
  }

  isSignup = !isSignup;
}

//SIGNUP
function signupUser() {
  const fName = document.getElementById("firstNameInput").value;
  const lName = document.getElementById("lastNameInput").value;
  const email = document.getElementById("emailInput").value;
  const pwd = document.getElementById("pwdInput").value;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  const existingUser = users.find((user) => {
    return email === user.email;
  });

  if (existingUser) {
    document.getElementById("snackbar-content").textContent =
      "Email is already there";
  } else {
    const newUser = {
      fName: fName,
      lName: lName,
      email: email,
      password: pwd,
      loggedIn: true,
    };

    users.push(newUser);
    console.log("users: ", users);

    localStorage.setItem("users", JSON.stringify(users));
    console.log("Users updated:", users);

    window.location.href = "profile.html";
  }
}

//LOGIN
function loginUser() {
  const email = document.getElementById("emailInput").value;
  const pwd = document.getElementById("pwdInput").value;

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  console.log(users);

  const existingUser = users.find((user) => {
    return email === user.email && pwd === user.password;
  });

  if (existingUser) {
    existingUser.loggedIn = true;

    // Save updated users list back to localStorage
    users = users.map((u) => (u.email === email ? existingUser : u));
    localStorage.setItem("users", JSON.stringify(users));

    document.getElementById("snackbar-content").textContent =
      "Logged in successfully";

    snackBarAnimation().then(() => {
      window.location.href = "profile.html";
    });
  } else {
    snackBarAnimation();
    document.getElementById("snackbar-content").textContent =
      "Invalid Credentials";
  }
}

//LOGOUT
function logout() {
  let users = JSON.parse(localStorage.getItem("users") || "[]");

  for (let i = 0; i < users.length; i++) {
    if (users[i].loggedIn) {
      users[i].loggedIn = false;
      break;
    }
  }

  localStorage.setItem("users", JSON.stringify(users));
  window.location.href = "index.html"; // Redirect after logout
}

function updateProfileNavLink() {
  const element = document.querySelector(".profile-nav-link");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedInUser = users.find((user) => user.loggedIn === true);

  if (loggedInUser) {
    element.setAttribute("href", "profile.html");
  } else if (element) {
    const modalElement = document.getElementById("loginModal");
    if (modalElement) {
      const loginModal = new bootstrap.Modal(modalElement, {
        keyboard: false,
      });
      loginModal.show();
    }
  }
}

function cartNavLink() {
  const element = document.querySelector(".cart-nav-link");
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedInUser = users.find((user) => user.loggedIn === true);

  if (loggedInUser && element) {
    element.setAttribute("href", "cart.html");
  } else if (element) {
    const modalElement = document.getElementById("loginModal");
    if (modalElement) {
      const loginModal = new bootstrap.Modal(modalElement, {
        keyboard: false,
      });
      loginModal.show();
    }
  }
}

//get profile details
function getProfileDetails() {
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const loggedInUser = users.find((user) => user.loggedIn === true);

  if (loggedInUser) {
    const profileName = document.querySelector(".profile-name");
    const profileEmail = document.querySelector(".profile-email");
    if (profileName && profileEmail) {
      profileName.textContent = loggedInUser.fName + " " + loggedInUser.lName;
      profileEmail.textContent = loggedInUser.email;
    }
  }
}

window.addEventListener("DOMContentLoaded", getProfileDetails);
