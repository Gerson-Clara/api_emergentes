-- CreateEnum
CREATE TYPE "Formatos" AS ENUM ('Quadrado', 'Redondo', 'Irregular');

-- CreateTable
CREATE TABLE "clientes" (
    "id" VARCHAR(36) NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(30) NOT NULL,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oculos" (
    "id" SERIAL NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "destaque" BOOLEAN NOT NULL DEFAULT true,
    "foto" TEXT NOT NULL,
    "formato" "Formatos" NOT NULL DEFAULT 'Irregular',
    "material" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "descricao" TEXT,
    "marcaId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL DEFAULT 1,
    "modelo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "oculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compras" (
    "id" SERIAL NOT NULL,
    "clienteId" VARCHAR(36) NOT NULL,
    "oculosId" INTEGER NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(60) NOT NULL,
    "email" VARCHAR(60) NOT NULL,
    "senha" VARCHAR(60) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" SERIAL NOT NULL,
    "descricao" VARCHAR(30) NOT NULL,
    "codigoFoto" TEXT NOT NULL,
    "oculosId" INTEGER NOT NULL,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "oculos" ADD CONSTRAINT "oculos_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "marcas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "oculos" ADD CONSTRAINT "oculos_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compras" ADD CONSTRAINT "compras_oculosId_fkey" FOREIGN KEY ("oculosId") REFERENCES "oculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_oculosId_fkey" FOREIGN KEY ("oculosId") REFERENCES "oculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
