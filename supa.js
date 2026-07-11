/*
=================================================
 RETRONETT
 SUPA.JS
 Sistema Supabase

 eu quero meu adevogado
=================================================
*/


// ===============================
// CONFIGURAÇÃO
// ===============================

const supabaseUrl =
"https://mecgmhcxwuzcbhbskmdh.supabase.co";


const supabaseKey =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY2dtaGN4d3V6Y2JoYnNrbWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM1NDE3NzUsImV4cCI6MjA5OTExNzc3NX0.WQ8CJBrZNrTOidXPo7FBERrOdyFdJ0ctWD5-psUohH8";


const supa =
supabase.createClient(
    supabaseUrl,
    supabaseKey
);



console.log(
    "RETRONETT Supabase Online!"
);



// ===============================
// AUTH
// ===============================


// Criar conta

async function criarConta(
    email,
    senha,
    username
){

    const {data,error} =
    await supa.auth.signUp({

        email: email,

        password: senha

    });



    if(error){

        alert(error.message);
        return;

    }



    await supa
    .from("profiles")
    .insert({

        id:data.user.id,

        username:username,

        admin:false

    });



    alert(
        "Conta criada!"
    );

}




// Login

async function login(
    email,
    senha
){

    const {data,error} =
    await supa.auth.signInWithPassword({

        email:email,

        password:senha

    });



    if(error){

        alert(
            "Email ou senha errados!"
        );

        return false;

    }



    return true;

}




// Logout

async function sair(){

    await supa.auth.signOut();

}




// Usuário atual

async function usuarioAtual(){

    const {data} =
    await supa.auth.getUser();


    return data.user;

}




// ===============================
// PERFIL
// ===============================


async function pegarPerfil(){


    const user =
    await usuarioAtual();



    if(!user)
        return null;



    const {data,error} =
    await supa

    .from("profiles")

    .select("*")

    .eq(
        "id",
        user.id
    )

    .single();



    if(error)
        return null;


    return data;

}



// ===============================
// BLOG
// ===============================



// Criar post

async function criarPost(
    titulo,
    texto
){


    const user =
    await usuarioAtual();



    if(!user){

        alert(
            "Faça login primeiro!"
        );

        return;

    }



    const {error} =
    await supa
    .from("posts")
    .insert({

        title:titulo,

        content:texto,

        author:user.id

    });



    if(error)
        console.log(error);

}



// Buscar posts

async function pegarPosts(){


    const {data,error} =
    await supa

    .from("posts")

    .select(`

        *

    `)

    .order(

        "created_at",

        {
            ascending:false
        }

    );



    if(error){

        console.log(error);

        return [];

    }



    return data;

}



// Apagar post

async function apagarPost(id){


    await supa

    .from("posts")

    .delete()

    .eq(
        "id",
        id
    );

}



// ===============================
// COMENTÁRIOS
// ===============================



async function criarComentario(
    postId,
    texto
){


    const user =
    await usuarioAtual();



    if(!user)
        return;



    await supa

    .from("comments")

    .insert({

        post_id:postId,

        author:user.id,

        text:texto

    });


}




async function pegarComentarios(
    postId
){


    const {data,error} =
    await supa

    .from("comments")

    .select("*")

    .eq(

        "post_id",

        postId

    )

    .order(

        "created_at",

        {
            ascending:true
        }

    );



    if(error)
        return [];


    return data;

}




// ===============================
// REALTIME
// ===============================


function ativarRealtime(){


    supa

    .channel(
        "posts"
    )

    .on(

        "postgres_changes",

        {

            event:"*",

            schema:"public",

            table:"posts"

        },


        (payload)=>{


            console.log(
                "Mudança:",
                payload
            );


        }

    )

    .subscribe();


}
