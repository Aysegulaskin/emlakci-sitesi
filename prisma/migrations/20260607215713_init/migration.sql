-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Ilan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "baslik" TEXT NOT NULL,
    "aciklama" TEXT NOT NULL,
    "fiyat" REAL NOT NULL,
    "tip" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "il" TEXT NOT NULL,
    "ilce" TEXT NOT NULL,
    "adres" TEXT NOT NULL,
    "metrekare" INTEGER NOT NULL,
    "odaSayisi" TEXT,
    "banyo" INTEGER,
    "kat" INTEGER,
    "toplamKat" INTEGER,
    "isitma" TEXT,
    "bina_yasi" INTEGER,
    "lat" REAL,
    "lng" REAL,
    "aktif" BOOLEAN NOT NULL DEFAULT true,
    "one_cikan" BOOLEAN NOT NULL DEFAULT false,
    "goruntuleme" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Resim" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "url" TEXT NOT NULL,
    "ilanId" TEXT NOT NULL,
    "sira" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Resim_ilanId_fkey" FOREIGN KEY ("ilanId") REFERENCES "Ilan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IlanOzellik" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "ilanId" TEXT NOT NULL,
    CONSTRAINT "IlanOzellik_ilanId_fkey" FOREIGN KEY ("ilanId") REFERENCES "Ilan" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mesaj" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ad" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefon" TEXT,
    "konu" TEXT NOT NULL,
    "mesaj" TEXT NOT NULL,
    "okundu" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
