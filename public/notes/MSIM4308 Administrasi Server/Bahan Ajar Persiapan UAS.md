# Bahan Ajar Persiapan UAS: Administrasi Sistem & Layanan Jaringan (CentOS 7)

---

## Modul 1: Manajemen User, Hak Akses, Monitoring, dan DNS

### 1. Pengelolaan User dan Group
Pada sistem Linux (CentOS), manajemen akun dilakukan melalui terminal dengan hak akses `root` atau `sudo`:

* **Membuat User Baru:** Menggunakan `useradd`. Opsi `-c` digunakan untuk menambahkan nama lengkap (*comment*).
  ```bash
  useradd -c "Nama Mahasiswa" <NIM>
  passwd <NIM>
  useradd -c "User Test" usertest
  passwd usertest
  ```
* **Memeriksa Daftar User:** Informasi akun tersimpan di `/etc/passwd` (berisi username, UID, GID, home directory, dan shell), sedangkan password terenkripsi disimpan terpisah di `/etc/shadow`.
  ```bash
  cat /etc/passwd
  ```
* **Hak Akses Setara Root (`wheel`):** Pada CentOS, anggota grup `wheel` diizinkan menjalankan perintah administratif menggunakan `sudo`.
  ```bash
  usermod -aG wheel <NIM>
  ```
  > **Catatan:** Opsi `-aG` wajib digabung agar user ditambahkan ke grup `wheel` tanpa menghapus keanggotaan grup bawaannya.
* **Mengubah Password & Menghapus User:** User biasa hanya bisa mengganti password sendiri dengan `passwd`, tetapi anggota `wheel` dapat mengganti password user lain maupun menghapusnya.
  ```bash
  sudo passwd usertest      # Mengganti password user lain
  sudo userdel -r usertest  # Menghapus user beserta direktori /home/usertest (-r)
  ```

### 2. Monitoring Aktivitas Login
* **`who`:** Menampilkan daftar pengguna yang **sedang aktif login** pada sistem saat ini beserta terminal dan waktu loginnya.
* **`last`:** Menampilkan **riwayat login** (dan reboot) yang pernah terjadi sebelumnya dengan membaca file log `/var/log/wtmp`.

### 3. Konfigurasi DNS Resolver
* **Mode Jaringan VirtualBox:** Menggunakan **NAT + DHCP** agar mesin virtual otomatis memperoleh alamat IP lokal dari VirtualBox dan dapat mengakses internet.
* **File `/etc/resolv.conf`:** Menentukan alamat server DNS yang digunakan sistem untuk menerjemahkan nama domain menjadi alamat IP.
  ```text
  nameserver 208.67.222.222
  nameserver 208.67.220.220
  ```
* **Pengujian Resolusi DNS:**
  * **`dig www.ut.ac.id`:** Menampilkan informasi DNS secara lengkap (bagian *QUESTION*, *ANSWER*, *AUTHORITY*, dan waktu kueri).
  * **`nslookup www.ut.ac.id`:** Menampilkan hasil resolusi IP dari server DNS secara ringkas.

---

## Modul 2: Berbagi File Jaringan dengan NFS (Network File System)

NFS memungkinkan sebuah komputer (*client*) mengakses direktori milik komputer lain (*server*) melalui jaringan seolah-olah direktori tersebut berada di penyimpanan lokalnya.

### 1. Syarat Jaringan VirtualBox
Agar mesin server dan klien dapat saling berkomunikasi, mode jaringan pada VirtualBox harus diatur ke **Bridged Adapter** (mendapat IP satu segmen dengan jaringan fisik) atau **NAT Network** (bukan NAT standar yang terisolasi antar-VM).

### 2. Alur Konfigurasi NFS Server
1. **Instalasi Paket:**
   ```bash
   sudo yum install nfs-utils -y
   ```
2. **Persiapan Direktori Share:** Membuat direktori `/data` dan mengatur kepemilikan ke user anonim default NFS (`nfsnobody`).
   ```bash
   sudo mkdir /data
   sudo chown nfsnobody:nfsnobody /data
   sudo chmod 755 /data
   ```
3. **Konfigurasi `/etc/exports`:** Mendefinisikan direktori yang dibagikan beserta hak akses klien.
   ```text
   /data *(rw,sync,no_root_squash,no_all_squash)
   ```
   * **`*`**: Mengizinkan semua alamat IP klien mengakses direktori ini.
   * **`rw`**: Klien memiliki izin baca (*read*) dan tulis (*write*).
   * **`sync`**: Server langsung menulis perubahan data ke disk sebelum mengirim balasan ke klien (mencegah kehilangan data).
   * **`no_root_squash`**: User `root` dari mesin klien tetap diakui sebagai `root` saat mengakses direktori NFS (tidak diturunkan haknya menjadi `nfsnobody`).
   * **`no_all_squash`**: User biasa dari klien tetap mempertahankan UID dan GID aslinya.
4. **Penerapan & Aktivasi Layanan:**
   ```bash
   sudo exportfs -a                 # Membaca ulang dan menerapkan /etc/exports
   sudo systemctl start nfs-server
   sudo systemctl enable nfs-server
   ```

### 3. Alur Konfigurasi NFS Client
1. **Instalasi Paket:**
   ```bash
   sudo yum install nfs-utils -y
   ```
2. **Mounting Direktori:** Membuat titik kait (*mount point*) lokal lalu menautkan direktori server ke dalamnya.
   ```bash
   sudo mkdir /mnt/nfs
   sudo mount <IP_Server>:/data /mnt/nfs
   ```
   *(Perubahan file di dalam `/mnt/nfs` pada klien akan langsung tersinkronisasi ke `/data` pada server).*

---

## Modul 3: Layanan Transfer File dengan FTP (`vsftpd`)

FTP bekerja di atas protokol TCP/IP (port default **21/tcp**) untuk pertukaran file antara server dan klien. Pada CentOS 7, layanan ini dijalankan menggunakan **vsftpd** (*Very Secure FTP Daemon*).

### 1. Instalasi dan Konfigurasi Firewall
Setelah menginstal paket `vsftpd` dan mengaktifkan layanannya, lalu lintas FTP harus dibuka pada firewall CentOS 7:
```bash
sudo firewall-cmd --permanent --add-port=21/tcp
sudo firewall-cmd --permanent --add-service=ftp
sudo firewall-cmd --reload
```
*(Opsi `--permanent` memastikan aturan tetap berlaku setelah reboot, dan `--reload` menerapkan aturan tanpa memutus koneksi aktif).*

### 2. Parameter Penting `/etc/vsftpd/vsftpd.conf`

| Parameter | Nilai | Fungsi Utama |
| :--- | :--- | :--- |
| **`write_enable`** | `YES` | Mengizinkan user FTP mengunggah (*upload*), mengubah nama, atau menghapus file di server. |
| **`chroot_local_user`** | `YES` | Mengurung user di dalam direktori home masing-masing (*chroot jail*) agar tidak bisa naik melihat sistem direktori root server. |
| **`chroot_list_enable`** | `YES` | Mengaktifkan daftar pengecualian user untuk mekanisme *chroot*. |
| **`chroot_list_file`** | `/etc/vsftpd/chroot_list` | Lokasi file berisi daftar username yang **diizinkan keluar** dari *chroot jail* (ketika `chroot_local_user=YES`). |

### 3. Manajemen User dan Direktori FTP
* **Membuat User Khusus FTP:**
  ```bash
  sudo useradd -m -s /sbin/nologin ftpuser
  sudo passwd ftpuser
  ```
  * `-m`: Otomatis membuat direktori home untuk user.
  * `-s /sbin/nologin`: Menolak akses login shell/terminal (SSH) demi keamanan, sehingga akun hanya bisa dipakai untuk layanan seperti FTP.
* **Mengatur Hak Akses Direktori Target:**
  ```bash
  sudo chown -R ftpuser:ftpuser /var/www/html
  sudo chmod -R 755 /var/www/html
  ```
  *(Opsi `-R` menerapkan perubahan kepemilikan dan izin secara rekursif ke seluruh isi subdirektori).*
* **Restart Layanan:** Setiap perubahan pada `vsftpd.conf` wajib diikuti `sudo systemctl restart vsftpd`. Pengujian dilakukan dari klien melalui File Explorer (`ftp://<IP_Server>`) atau aplikasi seperti FileZilla.

---

## Ringkasan File Konfigurasi & Direktori Kunci

| Lokasi File / Direktori | Layanan / Modul | Kegunaan |
| :--- | :--- | :--- |
| `/etc/passwd` | Manajemen User | Menyimpan daftar akun user dan konfigurasi dasar (UID, GID, home, shell). |
| `/etc/resolv.conf` | DNS Resolver | Menyimpan daftar alamat IP server DNS (`nameserver`). |
| `/etc/exports` | NFS Server | Mendefinisikan direktori yang dibagikan beserta izin akses klien NFS. |
| `/mnt/nfs` | NFS Client | Direktori *mount point* lokal tempat direktori server ditautkan. |
| `/etc/vsftpd/vsftpd.conf` | FTP Server | File konfigurasi utama layanan `vsftpd`. |
| `/etc/vsftpd/chroot_list` | FTP Server | Daftar pengecualian user dari pembatasan *chroot jail*. |

---

## Poin Rawan Jebakan UAS & Latihan Singkat

1. **Mengapa user FTP dibuat dengan shell `/sbin/nologin`?**
   * **Jawaban:** Untuk membatasi keamanan agar user tersebut hanya bisa melakukan autentikasi transfer file melalui layanan FTP, tanpa bisa masuk ke terminal server melalui konsol lokal maupun SSH.
2. **Apa perbedaan efek perintah `exportfs -a` dan `systemctl restart vsftpd`?**
   * **Jawaban:** `exportfs -a` memuat ulang tabel direktori share dari `/etc/exports` pada NFS tanpa harus memutus layanan secara penuh, sedangkan `systemctl restart vsftpd` menghentikan lalu menjalankan ulang daemon FTP agar perubahan di `vsftpd.conf` terbaca.
3. **Jika `chroot_local_user=YES` dan `chroot_list_enable=YES` diaktifkan bersamaan, apa fungsi file `/etc/vsftpd/chroot_list`?**
   * **Jawaban:** File tersebut berfungsi sebagai daftar **pengecualian**—user yang namanya tertulis di dalam `chroot_list` justru diperbolehkan keluar dari direktori home-nya, sementara user lain tetap dikurung (*chroot*).
4. **Mengapa konfigurasi `chmod 755` dan `chown` tetap dibutuhkan pada direktori `/data` (NFS) dan `/var/www/html` (FTP) meskipun di file konfigurasi sudah ditulis `rw` atau `write_enable=YES`?**
   * **Jawaban:** Karena izin di tingkat layanan jaringan (`exports` atau `vsftpd.conf`) tidak dapat melampaui izin sistem file Linux (*filesystem permissions*). Tanpa kepemilikan (`chown`) dan izin tulis (`chmod`) yang sesuai pada direktori fisik, operasi tulis dari klien tetap akan ditolak oleh kernel Linux.
