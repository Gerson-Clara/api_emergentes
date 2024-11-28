import express from 'express'
import cors from 'cors'

import marcasRoutes from './routes/marcas'
import oculosRoutes from './routes/oculos'
import fotosRoutes from './routes/fotos'
import clientesRoutes from './routes/clientes'
import comprasRoutes from './routes/compras'
import adminsRoutes from './routes/admins'
import dashboardRoutes from './routes/dashboard'

const app = express()
const port = 3004

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use("/marcas", marcasRoutes)
app.use("/oculos", oculosRoutes)
app.use("/fotos", fotosRoutes)
app.use("/clientes", clientesRoutes)
app.use("/compras", comprasRoutes)
app.use("/admins", adminsRoutes)
app.use("/dashboard", dashboardRoutes)

app.get('/', (req, res) => {
  res.send('API: Sistema de Estoque de Ótica')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})