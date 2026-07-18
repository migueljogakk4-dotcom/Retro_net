/*
RETRO NET
BLOG.JS V3
PARTE 1
*/

alert("blog.js carregou!");

let posts = [];

// ==========================
// ABRIR / FECHAR COMENTÁRIOS
// ==========================

function toggleComments(postId){

const box =
    document.getElementById(`commentsBox-${postId}`);

if(!box) return;

if(box.style.display === "none"){

    box.style.display = "block";

    loadComments(postId);

}else{

    box.style.display = "none";

}
}

// ==========================
// CARREGAR POSTS
// ==========================

async function loadPosts(){

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
    .order("created_at",{
        ascending:false
    });

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

            <button
                onclick="addComment('${post.id}')"
            >
                Enviar
            </button>

        </div>

    </div>

    `;

});
}
