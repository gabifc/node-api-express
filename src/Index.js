const express = require("express")

// body parse fazer depois de criar a userRoute toda
const bodyParser = require('body-parser')

// chamo o arquivo
const userRoute = require('./routers/userRoute')


// defino a porta
const port = 3000

// EXPRESS
const app = express()
// body parse parte 2
app.use(bodyParser.urlencoded({ extended: false }))

// importo o função do arquivo userRoute
usersRoute(app)

// crio uma res get para testar. Teste no terminal
app.get("/", (req, res) => res.send("Olá no express"))

// mostra na pagina. A const port fica dinâmica com S{}
app.listen(port, () => console.log(`Express rodando na porta ${port}`))