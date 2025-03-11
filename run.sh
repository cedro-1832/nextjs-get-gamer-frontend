#!/bin/bash

echo "========================================"
echo "🎮 Iniciando Games-App (Next.js 15)"
echo "========================================"

# 1️⃣ Eliminar `node_modules`, `package-lock.json` y `.next`
echo "🧹 Eliminando node_modules, package-lock.json y .next..."
rm -rf node_modules package-lock.json .next

# 2️⃣ Limpiar la caché de npm
echo "🗑 Limpiando caché de npm..."
sudo chown -R $USER:$USER ~/.npm
npm cache clean --force

# 3️⃣ Reinstalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 4️⃣ Buscar un puerto libre antes de iniciar el servidor
PORT=3000
while lsof -i :$PORT &>/dev/null; do
    ((PORT++))
done

# 4️⃣ Iniciar el servidor de desarrollo
echo "🚀 Iniciando el servidor de desarrollo en http://localhost:$PORT"
npm run dev -- -p $PORT
npm run build


