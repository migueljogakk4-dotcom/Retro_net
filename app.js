/*
================================================
RETRO NET
app.js
Versão sem Firebase
================================================
*/


// ================================
// CONFIGURAÇÃO
// ================================

const USERS_FILE = "users.json";
const POSTS_FILE = "posts.json";

let users = [];
let posts = [];

let currentUser = null;


// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener("DOMContentLoaded", () => {

    loadSession();

    loadUsers();

    loadPosts();

    updateUserUI();

});


// ================================
// CARREGAR USUÁRIOS
// ================================

async function loadUsers(){

    try{

        const response = await fetch(USERS_FILE);

        users = await response.json();

        console.log("Usuários carregados:", users);

    }

    catch(error){

        console.log("Erro carregando usuários:", error);

    }

}


// ================================
// CARREGAR POSTS
// ================================

async function loadPosts(){

    try{

        const response = await fetch(POSTS_FILE);

        posts = await response.json();

        console.log("Posts carregados:", posts);

        showPosts();

    }

    catch(error){

        console.log("Erro carregando posts:", error);

    }

}


// ================================
// LOGIN
// ================================

function login(){

    const username =
    document.getElementById("username").value;


    const password =
    document.getElementById("password").value;


    const user = users.find(u =>

        u.username === username &&
        u.password === password

    );


    if(user){

        currentUser = user;


        localStorage.setItem(

            "retro_session",

            JSON.stringify(user)

        );


        alert("Login realizado!");


        window.location.href =
        "index.html";


    }

    else{


        alert("Usuário ou senha incorretos.");


    }

}


// ================================
// SAIR
// ================================

function logout(){


    localStorage.removeItem(
        "retro_session"
    );


    currentUser = null;


    window.location.href =
    "login.html";


}


// ================================
// RESTAURAR LOGIN
// ================================

function loadSession(){


    const saved =
    localStorage.getItem(
        "retro_session"
    );


    if(saved){

        currentUser =
        JSON.parse(saved);

    }

}


// ================================
// MOSTRAR USUÁRIO
// ================================

function updateUserUI(){


    const area =
    document.getElementById(
        "userArea"
    );


    if(!area) return;


    if(currentUser){


        area.innerHTML = `

        <p>
        Olá, ${currentUser.username}!
        </p>

        <button onclick="logout()">
        Sair
        </button>

        `;


    }

    else{


        area.innerHTML = `

        <a href="login.html">
        Login
        </a>

        `;


    }


}


// ================================
// BLOG
// ================================

function showPosts(){


    const container =
    document.getElementById(
        "posts"
    );


    if(!container) return;


    container.innerHTML = "";


    posts.forEach(post =>{


        container.innerHTML += `

        <div class="card">

            <h2>
            ${post.titulo}
            </h2>


            <p>
            ${post.texto}
            </p>


            <small>
            Por ${post.autor}
            </small>


        </div>

        `;


    });


}




/*
================================================
RETRO NET
BLOG SYSTEM
Parte 2
================================================
*/


// ================================
// CRIAR POST
// ================================

function createPost(){

    if(!currentUser){

        alert("Faça login primeiro.");

        return;

    }


    const title =
    document.getElementById("postTitle").value;


    const text =
    document.getElementById("postText").value;


    if(title.trim()==="" ||
       text.trim()===""){

        alert("Preencha tudo.");

        return;

    }


    const newPost = {

        id: Date.now(),

        titulo:title,

        texto:text,

        autor:currentUser.username,

        data:new Date().toLocaleDateString(),

        likes:0

    };


    posts.unshift(newPost);


    saveLocalPosts();


    alert("Post criado!");


    showPosts();

}



// ================================
// SALVAR POSTS LOCAIS
// ================================

function saveLocalPosts(){

    localStorage.setItem(

        "retro_posts",

        JSON.stringify(posts)

    );

}



// ================================
// CARREGAR POSTS LOCAIS
// ================================

function loadLocalPosts(){


    const saved =

    localStorage.getItem(
        "retro_posts"
    );


    if(saved){

        posts =
        JSON.parse(saved);

    }


}



// ================================
// CURTIR POST
// ================================

function likePost(id){


    const post = posts.find(

        p => p.id === id

    );


    if(!post)return;


    post.likes++;


    saveLocalPosts();


    showPosts();


}



// ================================
// MOSTRAR POSTS ATUALIZADO
// ================================

function showPosts(){


    const container =

    document.getElementById(
        "posts"
    );


    if(!container)return;


    container.innerHTML="";


    posts.forEach(post=>{


        container.innerHTML += `

        <div class="card">


            <h2>
            ${post.titulo}
            </h2>


            <p>
            ${post.texto}
            </p>


            <small>
            👤 ${post.autor}
            <br>
            📅 ${post.data || ""}
            </small>


            <br><br>


            <button onclick="likePost(${post.id})">

            ❤️ ${post.likes || 0}

            </button>


        </div>


        `;


    });


}



// ================================
// EDITOR DE POST
// ================================

function openEditor(){


    if(!currentUser){

        alert("Entre na conta.");

        return;

    }


    const editor =

    document.getElementById(
        "postEditor"
    );


    if(editor){

        editor.style.display="block";

    }


}



// ================================
// INICIALIZAÇÃO DO BLOG
// ================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    loadLocalPosts();


    showPosts();


}

);
