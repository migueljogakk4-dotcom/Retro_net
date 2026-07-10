/*
==========================================
RETRO NET
BLOG.JS V2
PARTE 1
==========================================
*/

let posts = [];

// ==========================
// CARREGAR POSTS
// ==========================

async function loadPosts(){

    const container = document.getElementById("posts");

    if(!container) return;

    container.innerHTML = `
        <div class="card">
            Carregando posts...
        </div>
    `;

    const { data, error } = await supa
        .from("posts")
        .select(`
            id,
            title,
            content,
            likes,
            created_at,
            author,
            profiles (
                username
            )
        `)
        .order("created_at", { ascending:false });

    if(error){

        console.error(error);

        container.innerHTML = `
            <div class="card">
                <h2>Erro ao carregar posts</h2>
                <p>${error.message}</p>
            </div>
        `;

        return;

    }

    posts = data || [];

    renderPosts();

}



// ==========================
// MOSTRAR POSTS
// ==========================

function renderPosts(){

    const container = document.getElementById("posts");

    if(!container) return;

    container.innerHTML = "";

    if(posts.length === 0){

        container.innerHTML = `
            <div class="card">
                <h2>Nenhum post ainda.</h2>
            </div>
        `;

        return;

    }

    posts.forEach(post=>{

        const username =
            post.profiles?.username ||
            "Usuário";

        container.innerHTML += `

        <div class="card">

            <h2>${post.title}</h2>

            <p>${post.content}</p>

            <small>
                👤 ${username}
            </small>

            <br><br>

            <button onclick="likePost('${post.id}')">
                ❤️ ${post.likes || 0}
            </button>

            <br><br>

            <div id="comments-${post.id}"></div>

            <input
                id="comment-${post.id}"
                placeholder="Comentário..."
            >

            <button onclick="addComment('${post.id}')">
                Enviar
            </button>

        </div>

        `;

        loadComments(post.id);

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

    if(!title || !content){

        alert("Preencha todos os campos.");

        return;

    }

    const { data:userData } =
        await supa.auth.getUser();

    if(!userData.user){

        alert("Faça login.");

        return;

    }

    const { error } = await supa
        .from("posts")
        .insert({

            author:userData.user.id,

            title,

            content,

            likes:0

        });

    if(error){

        alert(error.message);

        console.error(error);

        return;

    }

    document.getElementById("postTitle").value = "";
    document.getElementById("postText").value = "";

    await loadPosts();

}



// ==========================
// INICIAR
// ==========================

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadPosts();

});



// ==========================
// CURTIR POST
// ==========================

async function likePost(postId){

    const post = posts.find(p=>p.id===postId);

    if(!post) return;

    const { error } = await supa
        .from("posts")
        .update({
            likes:(post.likes || 0)+1
        })
        .eq("id",postId);

    if(error){

        alert(error.message);

        return;

    }

    loadPosts();

}



// ==========================
// CARREGAR COMENTÁRIOS
// ==========================

async function loadComments(postId){

    const container =
        document.getElementById(`comments-${postId}`);

    if(!container) return;

    const { data, error } = await supa
        .from("comments")
        .select(`
            id,
            text,
            author,
            created_at,
            profiles(
                username
            )
        `)
        .eq("post_id",postId)
        .order("created_at",{ascending:true});

    if(error){

        console.error(error);

        return;

    }

    container.innerHTML="";

    if(data.length===0){

        container.innerHTML=`
            <small>
            Nenhum comentário.
            </small>
        `;

        return;

    }

    data.forEach(comment=>{

        container.innerHTML+=`

        <p>

        <b>

        ${comment.profiles?.username || "Usuário"}

        </b>

        <br>

        ${comment.text}

        </p>

        <hr>

        `;

    });

}



// ==========================
// NOVO COMENTÁRIO
// ==========================

async function addComment(postId){

    const input =
        document.getElementById(`comment-${postId}`);

    const text =
        input.value.trim();

    if(text==="") return;

    const { data:userData } =
        await supa.auth.getUser();

    if(!userData.user){

        alert("Faça login.");

        return;

    }

    const { error } = await supa
        .from("comments")
        .insert({

            post_id:postId,

            author:userData.user.id,

            text:text

        });

    if(error){

        alert(error.message);

        console.error(error);

        return;

    }

    input.value="";

    loadComments(postId);

}


// ==========================
// VERIFICAR ADMIN
// ==========================

async function isAdmin(){

    const { data:userData } =
        await supa.auth.getUser();

    if(!userData.user) return false;

    const { data } = await supa
        .from("profiles")
        .select("admin")
        .eq("id",userData.user.id)
        .single();

    return data?.admin === true;

}



// ==========================
// BOTÃO ADMIN
// ==========================

async function renderAdminButtons(post){

    if(!(await isAdmin())){

        return "";

    }

    return `

    <br><br>

    <button onclick="deletePost('${post.id}')">

    🗑️ Apagar Post

    </button>

    `;

}



// ==========================
// APAGAR POST
// ==========================

async function deletePost(postId){

    if(!confirm("Apagar este post?")){

        return;

    }

    const { error } = await supa
        .from("posts")
        .delete()
        .eq("id",postId);

    if(error){

        alert(error.message);

        return;

    }

    loadPosts();

}



// ==========================
// ATUALIZAR POSTS
// ==========================

setInterval(()=>{

    if(document.getElementById("posts")){

        loadPosts();

    }

},5000);
