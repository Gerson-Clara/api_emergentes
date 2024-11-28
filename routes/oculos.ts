import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import { verificaToken } from "../middewares/verificaToken"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const oculos = await prisma.oculos.findMany({
      orderBy: { id: 'desc' },
      include: {
        marca: true
      }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/destaques", async (req, res) => {
  try {
    const oculos = await prisma.oculos.findMany({
      orderBy: { id: 'desc' },
      include: {
        marca: true
      },
      where: { destaque: true }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", verificaToken, async (req, res) => {
  const { preco, destaque, foto, formato, material, genero, marcaId, descricao, modelo } = req.body

  if (!preco || !foto || !formato || !material || !genero || !marcaId || !descricao || !modelo) {
    res.status(400).json({ "erro": "Informe preco, foto, formato, material, genero, marcaid, descricao e modelo" })
    return
  }

  try {
    const oculos = await prisma.oculos.create({
      data: { preco, destaque, foto, formato, material, genero, marcaId, descricao, modelo }
    })
    res.status(201).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const oculos = await prisma.oculos.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/destacar/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const oculosDestacar = await prisma.oculos.findUnique({
      where: { id: Number(id) },
      select: { destaque: true }, 
    });

    const oculos = await prisma.oculos.update({
      where: { id: Number(id) },
      data: { destaque: !oculosDestacar?.destaque }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.put("/:id", verificaToken, async (req, res) => {
  const { id } = req.params
  const { preco, destaque, foto, formato, material, genero, marcaId, descricao, modelo } = req.body

  if (!preco || !destaque || !foto || !formato || !material || !genero || !marcaId || !descricao || !modelo) {
    res.status(400).json({ "erro": "Informe preco, destaque, foto, formato, material, genero, marcaid, descricao e modelo" })
    return
  }

  try {
    const oculos = await prisma.oculos.update({
      where: { id: Number(id) },
      data: { preco, destaque, foto, formato, material, genero, marcaId, descricao, modelo }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.get("/pesquisa/:termo", async (req, res) => {
  const { termo } = req.params

  // tenta converter o termo em número
  const termoNumero = Number(termo)

  // se a conversão gerou um NaN (Not a Number)
  if (isNaN(termoNumero)) {
    try {
      const oculos = await prisma.oculos.findMany({
        include: {
          marca: true
        },
        where: {
          OR: [
            { modelo: { contains: termo }},
            { marca: { nome: termo }}
          ]
        }
      })
      res.status(200).json(oculos)
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    try {
      const oculos = await prisma.oculos.findMany({
        include: {
          marca: true
        },
        where: {
          preco: { lte: termoNumero }          
        }
      })
      res.status(200).json(oculos)
    } catch (error) {
      res.status(400).json(error)
    }
  }
})

router.get("/:id", async (req, res) => {
  const { id } = req.params

  try {
    const oculos = await prisma.oculos.findUnique({
      where: { id: Number(id)},
      include: {
        marca: true
      }
    })
    res.status(200).json(oculos)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router