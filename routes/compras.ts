import { PrismaClient } from "@prisma/client"
import { Router } from "express"
import nodemailer from "nodemailer"
import { verificaToken } from "../middewares/verificaToken"

const prisma = new PrismaClient()
const router = Router()

router.get("/", async (req, res) => {
  try {
    const compras = await prisma.compra.findMany({
      include: {
        cliente: true,
        oculos: true
      },
      orderBy: { id: 'desc'}
    })
    res.status(200).json(compras)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.post("/", async (req, res) => {
  const { clienteId, oculosId, descricao } = req.body

  if (!clienteId || !oculosId || !descricao) {
    res.status(400).json({ erro: "Informe clienteId, oculosId e descricao" })
    return
  }

  try {
    const compra = await prisma.compra.create({
      data: { clienteId, oculosId, descricao }
    })
    const dados = await prisma.compra.findUnique({
      where: { id: Number(compra.id) },
      include: {
        cliente: true
      }
    })

    enviaEmail(dados?.cliente.nome as string,
      dados?.cliente.email as string,
      dados?.descricao as string)
    res.status(201).json(compra)
  } catch (error) {
    res.status(400).json(error)
  }
})

async function enviaEmail(nome: string, email: string,
  descricao: string) {

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false,
    auth: {
      user: "968f0dd8cc78d9",
      pass: "89ed8bfbf9b7f9"
    }
  });

  const info = await transporter.sendMail({
    from: 'placeholder@gmail.com', // sender address
    to: email, // list of receivers
    subject: "Re: Compra Ótica Avenida", // Subject line
    html: `<h3>Estimado Cliente: ${nome}</h3>
           <h3>Compra: ${descricao}</h3>
           <h3>Seu pedido foi enviado.</h3>
           <p>Muito obrigado pela compra!</p>
           <p>Ótica Avenida</p>`
  });

  console.log("Message sent: %s", info.messageId);
}

// router.patch("/:id", async (req, res) => {
//   const { id } = req.params
//   const { resposta } = req.body

//   if (!resposta) {
//     res.status(400).json({ "erro": "Informe a resposta desta compra" })
//     return
//   }

//   try {
//     const compra = await prisma.compra.update({
//       where: { id: Number(id) },
//       data: { resposta }
//     })

    

//     res.status(200).json(compra)
//   } catch (error) {
//     res.status(400).json(error)
//   }
// })

router.get("/:clienteId", async (req, res) => {
  const { clienteId } = req.params
  try {
    const compras = await prisma.compra.findMany({
      where: { clienteId },
      include: {
        oculos: true
      }
    })
    res.status(200).json(compras)
  } catch (error) {
    res.status(400).json(error)
  }
})

router.delete("/:id", verificaToken, async (req, res) => {
  const { id } = req.params

  try {
    const compra = await prisma.compra.delete({
      where: { id: Number(id) }
    })
    res.status(200).json(compra)
  } catch (error) {
    res.status(400).json(error)
  }
})

export default router