import { PrismaClient } from "@prisma/client"
import { Router } from "express"

const prisma = new PrismaClient()
const router = Router()

router.get("/gerais", async (req, res) => {
  try {
    const clientes = await prisma.cliente.count()
    const oculos = await prisma.oculos.count()
    const compras = await prisma.compra.count()
    res.status(200).json({ clientes, oculos, compras })
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/oculosMarca", async (req, res) => {
  try {
    const oculos = await prisma.oculos.groupBy({
      by: ['marcaId'],
      _count: {
        id: true, 
      }
    })

    // Para cada oculos, inclui o nome da marca relacionada ao marcaId
    const oculosMarca = await Promise.all(
      oculos.map(async (oculos) => {
        const marca = await prisma.marca.findUnique({
          where: { id: oculos.marcaId }
        })
        return {
          marca: marca?.nome, 
          num: oculos._count.id
        }
      })
    )
    res.status(200).json(oculosMarca)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router
