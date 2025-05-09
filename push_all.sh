#!/bin/bash

# Backend repository'sine git ve push yap
echo "🔄 Backend dizinine gidiliyor ve push yapılıyor..."
cd ~/Masaüstü/E-Commerce-Website/backend || { echo "❌ Backend dizini bulunamadı!"; exit 1; }
git add .
git commit -m "seller admin and order controller are designed"
git push origin main

# Frontend repository'sine git ve push yap
echo "🔄 Frontend dizinine gidiliyor ve push yapılıyor..."
cd ~/Masaüstü/E-Commerce-Website/frontend || { echo "❌ Frontend dizini bulunamadı!"; exit 1; }
git add .
git commit -m "admin panel is designed, seller panel is designed seller can add product, payment is finished, admin can revoke an order"
git push origin main

echo "✅ Push işlemi tamamlandı!"

