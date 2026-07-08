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

/*
================================================
RETRO NET
PERFIL SYSTEM
Parte 3
================================================
*/


// ================================
// PEGAR PERFIL
// ================================

function getCurrentProfile(){

    if(!currentUser){

        return null;

    }


    return currentUser;

}



// ================================
// MOSTRAR PERFIL
// ================================

function showProfile(){


    const area =

    document.getElementById(
        "profile"
    );


    if(!area)return;



    if(!currentUser){


        area.innerHTML = `

        <div class="card">

        Você não está logado.

        </div>

        `;


        return;

    }



    area.innerHTML = `

    <div class="card">


    <h2>

    ${currentUser.username}

    </h2>


    <p>

    ${currentUser.bio || 
    "Sem descrição."}

    </p>


    <button onclick="editBio()">

    Editar bio

    </button>


    </div>

    `;


}



// ================================
// EDITAR BIO
// ================================

function editBio(){


    if(!currentUser)return;



    const bio = prompt(

        "Digite sua nova bio:",

        currentUser.bio || ""

    );



    if(bio === null)return;



    currentUser.bio = bio;



    localStorage.setItem(

        "retro_session",

        JSON.stringify(currentUser)

    );



    updateUserList();



    showProfile();



}



// ================================
// ATUALIZAR USUÁRIO
// ================================

function updateUserList(){


    const index = users.findIndex(

        u =>

        u.username === currentUser.username

    );



    if(index === -1)return;



    users[index] = currentUser;



    localStorage.setItem(

        "retro_users",

        JSON.stringify(users)

    );


}



// ================================
// INICIAR PERFIL
// ================================

document.addEventListener(

"DOMContentLoaded",

()=>{


    showProfile();


});
/*
================================================
RETRO NET
COMMENTS SYSTEM
Parte 5
================================================
*/


// ================================
// CARREGAR COMENTÁRIOS
// ================================

let comments = JSON.parse(

    localStorage.getItem(
        "retro_comments"
    )

) || [];



// ================================
// SALVAR COMENTÁRIOS
// ================================

function saveComments(){

    localStorage.setItem(

        "retro_comments",

        JSON.stringify(comments)

    );

}



// ================================
// ADICIONAR COMENTÁRIO
// ================================

function addComment(postId){


    if(!currentUser){

        alert(
            "Faça login para comentar."
        );

        return;

    }



    const input =

    document.getElementById(

        "comment-" + postId

    );



    if(!input)return;



    const text = input.value.trim();



    if(text === ""){

        alert(
            "Digite um comentário."
        );

        return;

    }



    const comment = {


        id: Date.now(),


        postId: postId,


        author:
        currentUser.username,


        text: text,


        date:
        new Date()
        .toLocaleDateString()


    };



    comments.push(comment);



    saveComments();



    input.value = "";



    showPosts();



}



// ================================
// MOSTRAR COMENTÁRIOS
// ================================

function showComments(postId){


    const postComments =

    comments.filter(

        c => c.postId === postId

    );



    if(postComments.length === 0){


        return `

        <p>

        Nenhum comentário ainda.

        </p>

        `;


    }



    let html = "";



    postComments.forEach(comment=>{


        html += `

        <div class="comment">


        <strong>

        ${comment.author}

        </strong>


        <p>

        ${comment.text}

        </p>


        <small>

        ${comment.date}

        </small>


        </div>


        `;


    });



    return html;


}



// ================================
// ATUALIZAR SHOW POSTS
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

        </small>



        <br><br>



        <button onclick="likePost(${post.id})">

        ❤️ ${post.likes || 0}

        </button>



        <hr>



        <h3>

        Comentários

        </h3>



        ${showComments(post.id)}



        <input

        id="comment-${post.id}"

        placeholder="Comentar..."

        >



        <button onclick="addComment(${post.id})">

        Enviar

        </button>



        </div>


        `;


    });


}
