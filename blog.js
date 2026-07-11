// BLOG.JS V3C 


let posts = [];

async function loadPosts(){

const container = document.getElementById("posts");

if(!container) return;

container.innerHTML = `

<div class="card"> Carregando posts... </div> `;

const { data, error } = await supa
.from("posts")
.select("*, profiles ( username )")
.order("created_at", { ascending:false });

if(error){

container.innerHTML = `

<div class="card"> Erro ao carregar posts: <br> ${error.message} </div> `;

console.error(error);

return;

}

posts = data || [];

renderPosts();

}

function renderPosts(){

const container = document.getElementById("posts");

if(!container) return;

container.innerHTML = "";

if(posts.length === 0){

container.innerHTML = `

<div class="card"> Nenhum post ainda. </div> `;

return;

}

posts.forEach(post=>{

container.innerHTML += `

<div class="card"> <h2>${post.title}</h2> <p>${post.content}</p> <small> 👤 ${post.profiles?.username || "Usuário"} </small>

<br><br>

<button onclick="likePost('${post.id}')"> ❤️ ${post.likes || 0} </button>

<br><br>

<button onclick="toggleComments('${post.id}')"> 💬 Comentários </button> <div id="commentsBox-${post.id}" style="display:none"> <br> <div id="comments-${post.id}"> </div> <input id="comment-${post.id}" placeholder="Comentário"> <button onclick="addComment('${post.id}')"> Enviar </button> </div> </div>

`;

});

}

async function createPost(){

const title =
document.getElementById("postTitle").value.trim();

const content =
document.getElementById("postText").value.trim();

if(title === "" || content === ""){

alert("Preencha todos os campos.");

return;

}

const { data:userData } = await supa.auth.getUser();

if(!userData.user){

alert("Você precisa estar logado.");

return;

}

const { error } = await supa
.from("posts")
.insert({

title:title,

content:content,

author:userData.user.id,

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

}

async function likePost(postId){

const post = posts.find(
p => p.id === postId
);

if(!post) return;

const { error } = await supa
.from("posts")
.update({

likes:(post.likes || 0) + 1

})
.eq("id", postId);

if(error){

alert(error.message);

return;

}

loadPosts();

}

function toggleComments(postId){

const box =
document.getElementById(
"commentsBox-" + postId
);

if(!box) return;

if(box.style.display === "none"){

box.style.display = "block";

loadComments(postId);

}else{

box.style.display = "none";

}

}

async function loadComments(postId){

const container =
document.getElementById(
"comments-" + postId
);

if(!container) return;

const { data, error } = await supa
.from("comments")
.select("*, profiles(username)")
.eq("post_id", postId)
.order("created_at", { ascending:true });

if(error){

container.innerHTML =
"Erro ao carregar comentários.";

console.error(error);

return;

}

container.innerHTML = "";

if(data.length === 0){

container.innerHTML =
"Nenhum comentário.";

return;

}

data.forEach(comment=>{

container.innerHTML +=

"<p>" +
"<b>" +
(comment.profile?.username || "Usuário") + +
"</b>" +
"<br>" +
comment.text +
"</p>" +
"<hr>";

});

}

async function addComment(postId){

const input =
document.getElementById(
"comment-" + postId
);

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

text:text

});

if(error){

alert(error.message);

console.error(error);

return;

}

input.value = "";

loadComments(postId);

}

async function deletePost(postId){

const { error } = await supa
.from("posts")
.delete()
.eq("id", postId);

if(error){

alert(error.message);

return;

}

loadPosts();

}

document.addEventListener(
"DOMContentLoaded",
()=>{

loadPosts();

}
);
