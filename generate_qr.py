import qrcode

ip = "192.168.1.15"  # ← Replace with YOUR local IP
url = f"http://{ip}:5000"

qr = qrcode.make(url)
qr.save("menu_qr.png")

print(f"QR Code for: {url}")
