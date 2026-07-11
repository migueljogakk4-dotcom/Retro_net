// =====================
// BLOG.JS V3 AAAAAAA
// ========================

AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

alert("BLOG.JS V3");
throw new Error("PAREI AQUI");

let posts = [];

// ==========================
// ABRIR / FECHAR COMENTÁRIOS
// ==========================

function toggleComments(postId){

```
const box =
    document.getElementById(`commentsBox-${postId}`);

if(!box) return;

if(box.style.display === "none"){

    box.style.display = "block";

    loadComments(postId);

}else{

    box.style.display = "none";

}
```

}

// ==========================
// CARREGAR POSTS
// ==========================

async function loadPosts(){

```
const container =
    document.getElementById("posts");

if(!container) return;

container.innerHTML = `
    <div class="card">
        Carregando posts...
    </div>
`;

const { data, error } = await supa
    .from("posts")
    .select("*")
    .order("created_at", { ascending:false });

if(error){

    container.innerHTML = `
        <div class="card">
            <h2>Erro ao carregar posts</h2>
            <p>${error.message}</p>
        </div>
    `;

    console.error(error);

    return;

}

posts = data || [];

renderPosts();
```

}

// ==========================
// MOSTRAR POSTS
// ==========================

function renderPosts(){

```
const container =
    document.getElementById("posts");

if(!container) return;

container.innerHTML = "";

if(posts.length === 0){

    container.innerHTML = `
        <div class="card">
            Nenhum post ainda.
        </div>
    `;

    return;

}

posts.forEach(post=>{

    container.innerHTML += `

    <div class="card">

        <h2>${post.title}</h2>

        <p>${post.content}</p>

        <small>
            👤 ${post.author}
        </small>

        <br><br>

        <button onclick="likePost('${post.id}')">
            ❤️ ${post.likes || 0}
        </button>

        <br><br>

        <button onclick="toggleComments('${post.id}')">
            💬 Comentários
        </button>

        <div
            id="commentsBox-${post.id}"
            style="display:none;"
        >

            <br>

            <div id="comments-${post.id}"></div>

            <input
                id="comment-${post.id}"
                placeholder="Comentário..."
            >

            <button onclick="addComment('${post.id}')">
                Enviar
            </button>

        </div>

    </div>

    `;

});
```

}

// ==========================
// CRIAR POST
// ==========================

async function createPost(){

```
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

loadPosts();
```

}

// ==========================
// CURTIR
// ==========================

async function likePost(postId){

```
const post =
    posts.find(p => p.id === postId);

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
```

}

// ==========================
// CARREGAR COMENTÁRIOS
// ==========================

async function loadComments(postId){

```
const container =
    document.getElementById(`comments-${postId}`);

if(!container) return;

const { data, error } = await supa
    .from("comments")
    .select("*")
    .eq("post_id",postId)
    .order("created_at",{ascending:true});

if(error){

    console.error(error);

    return;

}

container.innerHTML = "";

if(data.length === 0){

    container.innerHTML = `
        <small>Nenhum comentário.</small>
    `;

    return;

}

data.forEach(comment=>{

    container.innerHTML += `

    <p>
        <b>${comment.author}</b>
        <br>
        ${comment.text}
    </p>

    <hr>

    `;

});
```

}

// ==========================
// NOVO COMENTÁRIO
// ==========================

async function addComment(postId){

```
const input =
    document.getElementById(`comment-${postId}`);

const text =
    input.value.trim();

if(text === "") return;

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

        text

    });

if(error){

    alert(error.message);

    console.error(error);

    return;

}

input.value = "";

loadComments(postId);
```

}

// ==========================
// ADMIN
// ==========================

async function deletePost(postId){

```
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
```

}

// ==========================
// INICIAR
// ==========================

document.addEventListener(

```
"DOMContentLoaded",

()=>{

    loadPosts();

}
```

);
