/*
==========================================
RETRO NET
BLOG.JS
Parte 1
==========================================
*/

let posts = [];


// ==========================
// CARREGAR POSTS
// ==========================

async function loadPosts(){

    const container =
    document.getElementById("posts");

    if(!container) return;

    container.innerHTML = "<h2>Carregando...</h2>";

    const {data,error} =
    await supa

    .from("posts")

    .select(`
        *,
        profiles(username)
    `)

    .order(
        "created_at",
        {
            ascending:false
        }
    );

    if(error){

        console.log(error);

        container.innerHTML =
        "<h2>Erro ao carregar.</h2>";

        return;

    }

    posts = data;

    renderPosts();

}



// ==========================
// MOSTRAR POSTS
// ==========================

function renderPosts(){

    const container =
    document.getElementById("posts");

    if(!container)return;

    container.innerHTML="";



    if(posts.length===0){

        container.innerHTML=`

        <div class="card">

        Nenhum post ainda.

        </div>

        `;

        return;

    }



    posts.forEach(post=>{

        container.innerHTML += `

        <div class="card">

        <h2>

        ${post.title}

        </h2>

        <p>

        ${post.content}

        </p>

        <small>

        👤 ${post.profiles?.username || "Desconhecido"}

        </small>

        <br><br>

        <button onclick="likePost('${post.id}')">

        ❤️ ${post.likes || 0}

        </button>

        <br><br>

        <div id="comments-${post.id}">

        </div>

        <input

        id="comment-${post.id}"

        placeholder="Comentário..."

        >

        <button onclick="addComment('${post.id}')">

        Enviar

        </button>

        </div>

        `;

    });

}



// ==========================
// CRIAR POST
// ==========================

async function createPost(){

    const title =
    document.getElementById("postTitle").value.trim();

    const content =
    document.getElementById("postText").value.trim();

    if(title==="" || content===""){

        alert("Preencha tudo.");

        return;

    }

    const {data} =
    await supa.auth.getUser();

    if(!data.user){

        alert("Faça login.");

        return;

    }

    const {error} =
    await supa

    .from("posts")

    .insert({

        author:data.user.id,

        title:title,

        content:content,

        likes:0

    });

    if(error){

        console.log(error);

        return;

    }

    document.getElementById("postTitle").value="";

    document.getElementById("postText").value="";

    loadPosts();

}



// ==========================
// INICIAR
// ==========================

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadPosts();

});
