const fs = require("fs")

// pasta de arquivos 
const { join } = require('path')

// caminho para arquivo Json que simula interação com banco de dados. Este arquivo JSON irá armazenar os dados do arquivo.
const filePath = join(__dirname, 'users.json');

// metodo para buscar os usuarios do arquivo
const getUsers = () => {
    // armazena o dado e verifica se o arquivo existe
    const data = fs.existsSync(filePath)
    // se o arquivo existe vamos ler de maneira assincrona para esperar o retorno dos dados
    ? fs.readFileSync(filePath) 
    // se ele não existir retorna um objeto vazio
    :! []
    // try catch para tratar o erro
    try {
        return JSON.parse(data)
    } catch (error) {
        return [];
    }
};


// metodo para salvar o usuario
// metodo fs escreve o arquivo, transforma em JSON e add  o objeto, null pq não quero outro parametro e \t vamos tabular o arquivo para ficar legivel.
const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'));

// criar a função
// a dependencia é o app
const userRouter = (app) => {
    // crio uma rota que cuida de todas as requisições GET POST PUT DELETE
    // parametro adicional é o id. Utilizo para add ou remover, editar pelo id
    app.route('/user/:id')
    // faço a solicitação
    .get((req, res) => {
        const users = getUsers()
        // retorno para o users em formato de objeto
        res.send({ users })
    })
    // metodo de criação de usuário
    .post((req, res) => {
        // buscamos os usuarios do banco de dados
        const users = getUsers()
        // aqui posso implementar novos dados como email por exemplo e criar funções para validar este e-mail, por ex.
        // const { email } = req.body
        //pega o objeto (que é array) dou push p inserir o novo registro neste objt
        // req.body é o corpo da requisição dos campos que envio no form, vai estar disponivel o nome do campo e o valor
        users.push(req.body)
        // uso a função para pegar o objeto atualizado e jogar no JSON
        saveUser(users)
        // resposta de status ok
        res.status(201).send('ok')
    })
    // rota para atualizar os usuários
    .put((req, res) => {
        // buscar os usuarios
        const users = getUsers()
        // map p criar um novo objeto usando o id
        saveUser(users.map(user => {
            //
            if(user.id === req.params.id) {
                //se o user id atual for = ao parametro que estou recebendo na req, retorna um obj com user atual fazendo o spred com o body para atualizar ele mesmo com os novos dados.
                return {
                    ...user,
                    ...req.body
                }
            }
            // se não retorna só o user sem fazer modificacao
            return user
        }))
        res.status(200).send('ok')
    })
    // deletar o registro do usuário
    .delete((req, res) =>{
        const users = getUsers()
        // filtrar o usuario que for diferente do id que estou passando na URL, salva todos os usuarios menos o usuario que tem o id indicado.
        saveUser(users.filter(user => user.id !== req.params.id))
        res.status(200).send('ok')
    })
}

module.exports = userRouter