alert("blog.js carregado!");

let posts = [];

// ==========================
// ABRIR / FECHAR COMENTÁRIOS
// ==========================

function toggleComments(postId){

const box =
document.getElementById(commentsBox-${postId});

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

<div class="card"> Carregando posts... </div> `;

const { data, error } = await supa
.from("posts")
.select(*, profiles ( username ))
.order("created_at", { ascending:false });

if(error){

container.innerHTML = `

<div class="card"> <h2>Erro ao carregar posts</h2> <p>${error.message}</p> </div> `;

console.error(error);

return;

}

posts = data || [];

renderPosts();

}
