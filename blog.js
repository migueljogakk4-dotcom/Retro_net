let posts = [];

const postsContainer = document.getElementById("posts");
const titleInput = document.getElementById("postTitle");
const textInput = document.getElementById("postText");

function escapeHtml(text) {
if (text === null || text === undefined) {
return "";
}

return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function getCurrentUserId() {
const {
data,
error
} = await supa.auth.getUser();

if (error || !data.user) {
    return null;
}

return data.user.id;
}

async function createPost() {
const title = titleInput.value.trim();
const content = textInput.value.trim();

if (!title || !content) {
    alert("Preencha o título e o conteúdo.");
    return;
}

const userId = await getCurrentUserId();

if (!userId) {
    alert("Faça login para publicar.");
    return;
}

const {
    error
} = await supa
    .from("posts")
    .insert({
        author: userId,
        title,
        content,
        likes: 0
    });

if (error) {
    alert(error.message);
    return;
}

titleInput.value = "";
textInput.value = "";

await loadPosts();
}

async function loadPosts() {
postsContainer.innerHTML = <div class="card"> Carregando posts... </div>;

const {
    data,
    error
} = await supa
    .from("posts")
    .select(`
        *,
        profiles(username)
    `)
    .order("created_at", {
        ascending: false
    });

if (error) {
    postsContainer.innerHTML = `
        <div class="card">
            Erro ao carregar posts.
        </div>
    `;
    return;
}

posts = data || [];

renderPosts();
}

function renderPosts() {
if (posts.length === 0) {
postsContainer.innerHTML = <div class="card"> Nenhum post encontrado. </div>;
return;
}

let html = "";

for (const post of posts) {
    const username =
        post.profiles?.username ||
        "Usuário";

    const date = new Date(
        post.created_at
    ).toLocaleString("pt-BR");

    html += `
        <div class="card">

            <h2>
                ${escapeHtml(post.title)}
            </h2>

            <p>
                <strong>
                    ${escapeHtml(username)}
                </strong>
            </p>

            <small>
                ${date}
            </small>

            <br><br>

            <p>
                ${escapeHtml(post.content)}
            </p>

            <br>

            <button
                class="button"
                onclick="likePost(${post.id})"
            >
                ❤ ${post.likes || 0}
            </button>

            <button
                class="button"
                onclick="toggleComments(${post.id})"
            >
                💬 Comentários
            </button>

            <div
                id="comments-${post.id}"
                style="display:none;margin-top:20px;"
            ></div>

        </div>

        <br>
    `;
}

postsContainer.innerHTML = html;
}
