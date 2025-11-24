#!/usr/bin/env python3
"""
Serveur HTTP simple pour visualiser le modèle 3D Renault 4L
Usage: python server.py
Puis ouvrez http://localhost:8000 dans votre navigateur
"""

import http.server
import socketserver
import os

PORT = 8001

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Ajouter les headers CORS pour éviter les problèmes de chargement
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print("=" * 60)
    print(f"Serveur demarre sur le port {PORT}")
    print(f"Repertoire: {os.getcwd()}")
    print("=" * 60)
    print(f"\nOuvrez votre navigateur sur:")
    print(f"   >> http://localhost:{PORT}")
    print(f"\nAppuyez sur Ctrl+C pour arreter le serveur\n")
    print("=" * 60)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nServeur arrete")
