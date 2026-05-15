const adminEmail = "abdohossam898@gmail.com";
const adminPassword = "123123123";

function getUsers(){
  return JSON.parse(localStorage.getItem("grillwave_users")) || [];
}

function saveUsers(users){
  localStorage.setItem("grillwave_users", JSON.stringify(users));
}

function currentUser(){
  return JSON.parse(localStorage.getItem("currentUser"));
}

function validateEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(id,text,isError=true){
  const box=document.getElementById(id);
  if(box){
    box.textContent=text;
    box.style.color=isError ? "#c0392b" : "#1e8449";
  }
}

function protectPages(){
  const user=currentUser();
  const page=window.location.pathname;
  const isLoginPage=page.includes("login.html");

  if(!user && !isLoginPage){
    window.location.href="login.html";
    return;
  }

  if(user && isLoginPage){
    window.location.href = user.role === "admin" ? "admin.html" : "index.html";
    return;
  }

  if(page.includes("admin.html") && user && user.role !== "admin"){
    window.location.href="index.html";
  }
}

const showLogin=document.getElementById("showLogin");
const showRegister=document.getElementById("showRegister");
const loginForm=document.getElementById("loginForm");
const registerForm=document.getElementById("registerForm");

if(showLogin && showRegister){
  showLogin.addEventListener("click",function(){
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    showLogin.classList.add("active");
    showRegister.classList.remove("active");
  });

  showRegister.addEventListener("click",function(){
    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    showRegister.classList.add("active");
    showLogin.classList.remove("active");
  });
}

if(registerForm){
  registerForm.addEventListener("submit",function(e){
    e.preventDefault();

    const name=document.getElementById("regName").value.trim();
    const email=document.getElementById("regEmail").value.trim();
    const password=document.getElementById("regPassword").value.trim();
    const phone=document.getElementById("regPhone").value.trim();
    const address=document.getElementById("regAddress").value.trim();

    if(!name || !email || !password || !phone || !address){
      showMessage("registerMessage","Please complete all fields.");
      return;
    }

    if(!validateEmail(email)){
      showMessage("registerMessage","Please enter a valid email.");
      return;
    }

    if(password.length < 6){
      showMessage("registerMessage","Password must be at least 6 characters.");
      return;
    }

    let users=getUsers();

    if(users.find(user => user.email === email)){
      showMessage("registerMessage","Email already exists. Please login.");
      return;
    }

    const newUser={
      id:Date.now(),
      name:name,
      email:email,
      password:password,
      phone:phone,
      address:address,
      favorite:"",
      role:"user"
    };

    users.push(newUser);
    saveUsers(users);

    localStorage.setItem("currentUser",JSON.stringify(newUser));
    showMessage("registerMessage","Account created successfully.",false);

    setTimeout(function(){
      window.location.href="index.html";
    },700);
  });
}

if(loginForm){
  loginForm.addEventListener("submit",function(e){
    e.preventDefault();

    const email=document.getElementById("loginEmail").value.trim();
    const password=document.getElementById("loginPassword").value.trim();

    if(!email || !password){
      showMessage("loginMessage","Please enter email and password.");
      return;
    }

    if(email === adminEmail && password === adminPassword){
      const adminUser={
        id:1,
        name:"Restaurant Admin",
        email:adminEmail,
        password:adminPassword,
        phone:"01000000000",
        address:"GrillWave Main Branch",
        favorite:"Management",
        role:"admin"
      };

      localStorage.setItem("currentUser",JSON.stringify(adminUser));
      window.location.href="admin.html";
      return;
    }

    const users=getUsers();
    const user=users.find(u => u.email === email);

    if(!user){
      showMessage("loginMessage","Email not found. Please register first.");
      return;
    }

    if(user.password !== password){
      showMessage("loginMessage","Wrong password.");
      return;
    }

    localStorage.setItem("currentUser",JSON.stringify(user));
    window.location.href="index.html";
  });
}

const logoutBtn=document.getElementById("logoutBtn");

if(logoutBtn){
  logoutBtn.addEventListener("click",function(){
    localStorage.removeItem("currentUser");
    window.location.href="login.html";
  });
}

protectPages();