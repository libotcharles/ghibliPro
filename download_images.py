#!/usr/bin/env python3
"""
Script per scaricare le immagini dei film Ghibli automaticamente
usando Bing Image Search (no API key richiesta)
"""

import os
import json
import shutil
from pathlib import Path
from bing_image_downloader import downloader

# Configurazione
DATA_FILE = "data-locations.json"
IMG_DIR = "assets/img/locations"
TEMP_DIR = "temp_images"

def ensure_directory():
    """Crea la directory se non esiste"""
    os.makedirs(IMG_DIR, exist_ok=True)
    print(f"✅ Directory '{IMG_DIR}' controllata/creata\n")

def download_and_move(query, output_filename, limit=1):
    """Scarica immagine da Bing e la sposta con il nome giusto"""
    try:
        print(f"   Cercando: {query}...")
        
        # Scarica da Bing
        downloader.download(
            query, 
            limit=limit,
            output_dir=TEMP_DIR,
            adult_filter_off=True,
            force_replace=False,
            timeout=20,
            verbose=False
        )
        
        # Trova il primo file scaricato
        temp_path = os.path.join(TEMP_DIR, query)
        if os.path.exists(temp_path):
            files = os.listdir(temp_path)
            if files:
                # Prendi il primo file
                source = os.path.join(temp_path, files[0])
                dest = os.path.join(IMG_DIR, output_filename)
                
                # Se esiste già, non sovrascrivere
                if not os.path.exists(dest):
                    shutil.copy2(source, dest)
                    file_size = os.path.getsize(dest) / 1024
                    print(f"   ✓ Scaricato: {output_filename} ({file_size:.1f} KB)")
                    return True
                else:
                    print(f"   ⚠️  {output_filename} esiste già")
                    return True
        
        print(f"   ⚠️  Non trovato: {query}")
        return False
        
    except Exception as e:
        print(f"   ✗ Errore: {str(e)[:60]}")
        return False

def download_film_images(title, location, real_filename, film_filename):
    """Scarica le immagini per un film"""
    
    print(f"🎥 {title}")
    print(f"   📍 Locazione: {location}")
    
    # Scarica immagine della locazione reale
    download_and_move(f"{location} landscape", real_filename, limit=1)
    
    # Scarica immagine dal film
    download_and_move(f"{title} Ghibli", film_filename, limit=1)
    
    print()

def cleanup_temp():
    """Pulisce la cartella temporanea"""
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        print("🧹 Cartella temporanea pulita\n")

def main():
    """Funzione principale"""
    print("🎬 Download Immagini Ghibli World Atlas\n")
    print("=" * 50)
    
    ensure_directory()
    
    # Leggi il JSON
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"❌ File {DATA_FILE} non trovato!")
        return
    
    locations = data.get('locations', [])
    print(f"📂 Trovati {len(locations)} film da elaborare\n")
    print("=" * 50 + "\n")
    
    downloaded = 0
    
    for i, film in enumerate(locations, 1):
        title = film.get('title', 'Unknown')
        location = film.get('location', 'Unknown')
        real_img = film.get('realImage', '')
        film_img = film.get('filmImage', '')
        
        if real_img and film_img:
            real_filename = real_img.split('/')[-1]
            film_filename = film_img.split('/')[-1]
            
            try:
                download_film_images(title, location, real_filename, film_filename)
                downloaded += 1
            except Exception as e:
                print(f"❌ Errore elaborando {title}: {e}\n")
        else:
            print(f"⚠️  {title}: dati immagine mancanti\n")
    
    cleanup_temp()
    
    print("=" * 50)
    print(f"\n✅ Completato! {downloaded}/{len(locations)} film elaborati")
    print(f"📂 Immagini salvate in: {IMG_DIR}")

if __name__ == "__main__":
    main()
