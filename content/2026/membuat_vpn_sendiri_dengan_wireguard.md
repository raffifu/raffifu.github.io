title=Membuat VPN Sendiri dengan Wireguard
description=Eksperimen membuat VPN server di linux
date=2026-06-20
type=post
status=published
~~~~~~
Minggu lalu saya melihat postingan di linkedin tentang vpn murah dari https://santainetwork.id/ dan saya tertarik dengan testimoninya yang menyatakan "...menghilangkan packet loss dari ISP dari game online saya...". Pernyataan ini membuat saya bertanya sekaligus mencoba service tersebut untuk membuktikannya. 

Kalau dianalogikan vpn malah menambahkan hop baru karena routing yang seharusnya direct ke server target sekarang harus melalui vpn terlebih dahulu. Belum lagi ada step tambahan yaitu decrypt & encrypt packet. Sehingga seharusnya akan lebih lambat, tapi menariknya setelah mencoba servicenya, packet lost internet saya berkurang dan menjadi stabil. seperti terlampir pada gambar berikut:

![Komparasi menggunakan VPN](https://github.com/user-attachments/assets/420b9321-4031-4652-b37e-aa5e597c0cb7)

> Note:
> Memang ada beberapa faktor yang bisa menyebabkan koneksi jadi lebih stabil, seperti ISP throttling (aktivitas seperti gaming atau streaming sengaja dibatasi speednya) dan routing ISP. Dengan VPN kita tentu bisa melewati ISP throttling karena packet yang terenkripsi & mungkin saja routing VPN akan lebih baik dibanding ISP.

Sayangnya, paket vpn yang saya coba hanya memiliki speed maksimal 20Mbps yang overall membuat speed internet saya turun. Hal ini menjadikan saya tertarik untuk mencoba membuat vpn server sendiri.

## Prerequisite - Membeli VM
Untuk uji coba ini saya akan pakai layanan dari https://8labs.id dengan spesifikasi 1vCPU 1GB Memory Elasticlabs NAT. VM ini tidak memiliki public ip tapi kita bisa request untuk port forwarding. Dengan hanya Rp. 4,250 / minggu kita sudah mendapat semuanya + bandwith 5TB + outgoing mullvad vpn. Cukup murah untuk sebuah eksprimen.

Tetapi apabila ingin mencoba cloud provider lain ada beberapa hal yang dapat dipertimbangkan supaya mendapatkan performance yang maksimal:
1. Lokasi di Indonesia (pilih latensi paling minimal dari ISP anda ke cloud provider)
2. Harga terjangkau
3. Generous Bandwidth
4. IP Publik (biar bisa connect ke server)

## Memilih Protokol VPN - Wireguard
Sebenarnya ada banyak jenis VPN, yang paling umum dan mudah untuk self hosted diantaranya adalah OpenVPN & Wireguard. Dari beberapa sumber mengatakan wireguard memiliki performance yang lebih baik dan lebih cepat, maka kita akan menggunakan wireguard.
## Setup Wireguard di Server
Untuk memudahkan installasi, kita akan memakai script dari repo berikut: https://github.com/angristan/wireguard-install. Cukup dengan menjalankan command berikut:

```sh
curl -O https://raw.githubusercontent.com/angristan/wireguard-install/master/wireguard-install.sh
chmod +x wireguard-install.sh
./wireguard-install.sh
```

Secara garis besar yang akan dilakukan oleh script diatas adalah:
1. Install wireguard dan beberapa dependensi (iptables, resolvconf)
2. Buat konfigurasi untuk server yang meliputi:
	- Generate private key & public key untuk server
	- Enable IP forwarding
	- Setup firewall
	- Pilih IP Address Server
3. Buat konfigurasi untuk client:
	- Generate pair private key & public key untuk client

Secara garis besar script tersebut akan membuat konfigurasi server dan client dengan struktur sebagai berikut:
```ini
# Wireguard Server Config
[Interface]
Address = 10.66.66.1/24,fd42:42:42::1/64
ListenPort = 51820
PrivateKey = <private-key-server>
PostUp = ...
PostDown = ...

### Client homelab
[Peer]
PublicKey = <public-key-client>
PresharedKey = <opt-samepreshared-keys>
AllowedIPs = 10.66.66.2/32,fd42:42:42::2/128
```

> Note: 
> - PostUp & PostDown akan berisi command iptables yang akan running ketika wireguard server start (PostUp) dan ketika berhenti (PostDown)
> - Preshared-key sebenarnya optional, fungsinya untuk symetric algorithm ketika pertukaran public & private key. value ini harus sama dengan konfigurasi di client

```ini
# Wireguard Client Config
[Interface]
PrivateKey = <private-key-client>
Address = 10.66.66.2/32,fd42:42:42::2/128
DNS = 1.1.1.1,1.0.0.1

[Peer]
PublicKey = <public-key-server>
PresharedKey = <opt-samepreshared-keys>
Endpoint = <server-ip-and-port>
AllowedIPs = 0.0.0.0/0,::/0
```

Dapat dilihat keduanya memiliki struktur konfigurasi yang mirip, masing-masing memiliki konfigurasi virtual network adapter yang dikonfigurasi sebagai block "Interface" dan remote target yang disetup dalam block "Peer". Untuk mencoba konfigurasi tersebut di android, saya menginstall client wireguard dari laman [berikut ini](https://download.wireguard.com/android-client/)
## Limitasi
Sayangnya ISP yang dipakai oleh VM ElasticLabs NAT ini memiliki proteksi UDP Flooding. Sehingga setiap saya melakukan speedtest, vpn yang dipakai suka mati sendiri. Walaupun sudah coba reconnect ulang tapi sama saja. Solusinya adalah mendapatkan IP Public baru dengan toggle mode pesawat. Secara overall, saya sudah mencoba lebih dari satu hari untuk dua device dan semuanya keduanya aman. Berikut merupakan summary dengan vpn:

![Hasil Akhir Komparasi VPN Server Sendiri](https://github.com/user-attachments/assets/14c7552a-df77-4a0e-a852-c9f31be10251)

## Additonal Information
Setup VPN dari tulisan ini tentu saja manual dan susah diimplementasikan untuk skala user yang lebih besar. Ada salah satu tools yang pernah saya gunakan ketika setup vpn untuk skala perusahaan, yaitu [pritunl](https://github.com/pritunl/pritunl). Singkatnya dengan pritunl kita bisa monitoring user, manage user & memilih protocol secara lebih mudah dengan GUI. Aplikasi ini open source
