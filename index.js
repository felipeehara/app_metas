const {select,input,checkbox} = require ('@inquirer/prompts'); //MENU INTERATIVO COM O USUARIO
const fs = require("fs").promisses;

let mensagem ='Bem vindo ao App de Metas!';
 
let metas 

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados) 
    }
    catch(erro) {
        metas = [];
    }
}

const salvarMetas = async () => {
    await fs.whiteFile("metas.json", JSON.stringify(metas, null, 2))
}


async function cadastrarMeta() {
    const meta = await input({
        message: "Qual é a meta?"
    })
    if(meta.length == 0) {
        mensagem = "A meta não pode estar vazia!";
        return
    }

    metas.push({
        value: meta,
        checked: false,
    });
    mensagem = "Meta cadastrada com sucesso!";
}

async function listarMetas() {
    const respostas = await checkbox ({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa.",
        choices: [...metas],
        instructions: false
    })

    metas.forEach((m) => {
        m.checked = false;
    })

    if(respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada!";
        return 
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
        })

        meta.checked = true
    })
    mensagem = "Meta(s) marcada(s) como concluída(s)";
}

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked;
    });

    if (realizadas.length == 0) {
        mensagem = "Não existem metas realizadas!";
        return
    }

    await select ({
        message: "Metas Realizadas: " + realizadas.length,
        choices: [... realizadas]
    })
}

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        mensagem = "Não existe metas abertas! :)";
        return
    }

    await select({
        message: "Metas Abertas: " + abertas.length,
        choices: [... abertas]
    })
}

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false } 
    }) 
    const itemsADeletar = await checkbox ({
        message: "Selecione os item para deletar.",
        choices: [...metasDesmarcadas],
        instructions: false
    })

    if(itemsADeletar.length == 0) {
        mensagem = "Nenhum item para deletar!";
        return
    }

    itemsADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item; 
        })
    })

    mensagem = "Meta(s) deletada(s) com sucesso!";
}

const mostrarMensagem = () => {
    console.clear();

    if(mensagem != '') {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
}

async function start() {
    await carregarMetas()
    
    while(true) {

        mostrarMensagem();
        await salvarMetas()


        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar metas",
                    value: "cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "listar"
                },
                {
                    name: "Metas realizadas",
                    value: "realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "abertas"
                },
                {
                    name: "Deletar Metas",
                    value: "deletar"
                },
                {
                    name: "Sair",
                    value: "sair"
                    
                }
            ],
        })


       
       switch(opcao) {
        case "cadastrar":
            await cadastrarMeta();
            break;
        case "listar":
            await listarMetas();
            break;   
        case "realizadas":
            await metasRealizadas();
            break;   
        case "abertas":
            await metasAbertas();
            break;
        case "deletar":
            await deletarMetas();
            break;           
        case "sair": 
            console.log("Encerrando aplicação!")   
            return 
       }
    }
}

start()