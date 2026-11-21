# Panduan & Materi Persiapan UAS: Pengantar Statistika (MKKI4201)

Dokumen ini disusun berdasarkan pemetaan materi dari **Tugas Tutorial I, II, dan III** mata kuliah **Pengantar Statistika (MKKI4201)**. Setiap bab memuat konsep inti, kumpulan rumus penting, jebakan soal yang sering muncul di UAS, serta pembahasan langkah demi langkah dari soal tugas Anda.

---

## Bagian 1: Statistika Deskriptif & Ukuran Pemusatan Data

### 1.1 Memilih Ukuran Pemusatan yang Tepat (Mean vs Median vs Modus)
Dalam menganalisis sekumpulan data, pemilihan ukuran pemusatan sangat bergantung pada bentuk distribusi data dan keberadaan nilai ekstrem (*outlier*):
* **Mean (Rata-rata Hitung):** Cocok digunakan jika distribusi data simetris dan tidak memiliki pencilan (*outlier*). Sifatnya sensitif terhadap nilai ekstrem.
* **Median (Nilai Tengah):** Pilihan terbaik apabila data memiliki **nilai ekstrem (*outlier*)** atau distribusinya menceng (*skewed*), seperti data pendapatan penduduk atau harga properti. Median tidak terpengaruh oleh nilai yang terlalu besar atau terlalu kecil.
* **Modus (Nilai yang Paling Sering Muncul):** Digunakan untuk data berskala nominal/kategorik atau untuk mengetahui tren terbanyak.

> **Penerapan pada Tugas 1 (Soal 1):**
> Pada data pendapatan 20 penduduk Desa Bakti Mulya, mayoritas warga berpendapatan antara Rp 200.000 hingga Rp 700.000, tetapi terdapat beberapa penduduk dengan pendapatan ekstrem sebesar Rp 10.000.000 dan Rp 15.000.000. Karena distribusi menceng ke kanan (*positively skewed*), ukuran yang paling tepat digunakan adalah **Median** agar gambaran pendapatan masyarakat tidak terdistorsi ke atas oleh segelintir orang berpendapatan sangat tinggi.

---

### 1.2 Rumus Ukuran Pemusatan & Letak Data Berkelompok
Untuk data yang disajikan dalam tabel distribusi frekuensi dengan panjang kelas interval $p$:

1. **Rata-rata (Mean):**
   $$\bar{x} = \frac{\sum f_i x_i}{\sum f_i}$$
   *(dengan $x_i$ adalah titik tengah kelas ke-$i$ dan $f_i$ adalah frekuensi kelas ke-$i$)*

2. **Median ($Me$):**
   $$Me = Tb + \left( \frac{\frac{1}{2}n - F}{f_{me}} \right) p$$

3. **Modus ($Mo$):**
   $$Mo = Tb + \left( \frac{d_1}{d_1 + d_2} \right) p$$

4. **Kuartil ke-$i$ ($Q_i$, untuk $i = 1, 2, 3$):**
   $$Q_i = Tb + \left( \frac{\frac{i}{4}n - F}{f_{Qi}} \right) p$$

5. **Persentil ke-$i$ ($P_i$, untuk $i = 1, 2, \dots, 99$):**
   $$P_i = Tb + \left( \frac{\frac{i}{100}n - F}{f_{Pi}} \right) p$$

**Keterangan Simbol:**
* $Tb$: Tepi bawah kelas yang memuat ukuran tersebut (batas bawah dikurangi $0.5$ untuk data bilangan bulat).
* $n$: Jumlah seluruh frekuensi ($\sum f_i$).
* $F$: Frekuensi kumulatif sebelum kelas yang dimaksud.
* $f$: Frekuensi pada kelas yang dimaksud.
* $d_1$: Selisih frekuensi kelas modus dengan frekuensi kelas sebelumnya.
* $d_2$: Selisih frekuensi kelas modus dengan frekuensi kelas sesudahnya.
* $p$: Panjang interval kelas.

> **Catatan Penting UAS:** Nilai $Q_1 = P_{25}$, nilai $Me = Q_2 = D_5 = P_{50}$, dan nilai $Q_3 = P_{75}$. Jika kedua ukuran ini ditanyakan dalam satu soal yang sama, nilainya pasti identik!

---

### 1.3 Pembahasan Tugas 1 (Soal 2: Penjualan Harian Toko Grosir)
Diketahui tabel distribusi frekuensi dengan total hari $n = 3 + 5 + 7 + 9 + 4 + 2 = 30$ dan panjang kelas $p = 10$:

| Interval Penjualan | Frekuensi ($f_i$) | Titik Tengah ($x_i$) | $f_i \cdot x_i$ | Frekuensi Kumulatif ($F_{kum}$) |
| :--- | :---: | :---: | :---: | :---: |
| $10 - 19$ | $3$ | $14.5$ | $43.5$ | $3$ |
| $20 - 29$ | $5$ | $24.5$ | $122.5$ | $8$ |
| $30 - 39$ | $7$ | $34.5$ | $241.5$ | $15$ |
| $40 - 49$ | $9$ | $44.5$ | $400.5$ | $24$ |
| $50 - 59$ | $4$ | $54.5$ | $218.0$ | $28$ |
| $60 - 69$ | $2$ | $64.5$ | $129.0$ | $30$ |
| **Jumlah** | **$30$** | - | **$1155.0$** | - |

* **a. Rata-rata ($\bar{x}$):**
  $$\bar{x} = \frac{1155}{30} = 38.5 \text{ juta rupiah}$$

* **b. Median ($Me$):**
  Letak data ke-$\frac{1}{2}(30) = 15$, berada pada kelas $30 - 39$ ($Tb = 29.5$, $F = 8$, $f_{me} = 7$):
  $$Me = 29.5 + \left( \frac{15 - 8}{7} \right) 10 = 29.5 + 10 = 39.5 \text{ juta rupiah}$$

* **c. Modus ($Mo$):**
  Frekuensi tertinggi adalah $9$ pada kelas $40 - 49$ ($Tb = 39.5$, $d_1 = 9 - 7 = 2$, $d_2 = 9 - 4 = 5$):
  $$Mo = 39.5 + \left( \frac{2}{2 + 5} \right) 10 = 39.5 + \frac{20}{7} \approx 42.36 \text{ juta rupiah}$$

* **d. Kuartil ke-3 ($Q_3$):**
  Letak data ke-$\frac{3}{4}(30) = 22.5$, berada pada kelas $40 - 49$ ($Tb = 39.5$, $F = 15$, $f_{Q3} = 9$):
  $$Q_3 = 39.5 + \left( \frac{22.5 - 15}{9} \right) 10 = 39.5 + \frac{75}{9} \approx 47.83 \text{ juta rupiah}$$

* **e. Persentil ke-75 ($P_{75}$):**
  Karena posisi $P_{75}$ adalah $\frac{75}{100}(30) = 22.5$, maka $P_{75} = Q_3 \approx 47.83 \text{ juta rupiah}$.

---

## Bagian 2: Variabilitas Data, Distribusi Sampling & Estimasi Titik

### 2.1 Standar Deviasi dan Standar Eror (*Standard Error*)
Perhatikan perbedaan pembagi pada rumus varians/standar deviasi:
1. **Standar Deviasi Populasi ($\sigma$):**
   $$\sigma = \sqrt{\frac{\sum (x_i - \mu)^2}{N}}$$
2. **Standar Deviasi Sampel ($s$):**
   $$s = \sqrt{\frac{\sum (x_i - \bar{x})^2}{n - 1}} = \sqrt{\frac{\sum x_i^2 - \frac{(\sum x_i)^2}{n}}{n - 1}}$$
3. **Standar Eror / Standar Deviasi Distribusi Sampling Rata-rata ($\sigma_{\bar{x}}$ atau $SE$):**
   * Jika $\sigma$ populasi diketahui dan sampel diambil **dengan pengembalian** (atau populasi tak terbatas):
     $$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}}$$
   * Jika $\sigma$ populasi diketahui dan sampel diambil **tanpa pengembalian** dari populasi terbatas berukuran $N$:
     $$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}} \sqrt{\frac{N - n}{N - 1}}$$
   * Jika $\sigma$ populasi tidak diketahui (estimasi standar eror dari sampel):
     $$SE = \frac{s}{\sqrt{n}}$$

> **Pembahasan Tugas 1 (Soal 3):**
> Data nilai intelegensi 5 caleg: $60, 65, 70, 85, 90$ ($N = 5$).
> * Rata-rata populasi: $\mu = \frac{60 + 65 + 70 + 85 + 90}{5} = \frac{370}{5} = 74$.
> * Varians populasi: $\sigma^2 = \frac{(60-74)^2 + (65-74)^2 + (70-74)^2 + (85-74)^2 + (90-74)^2}{5} = \frac{196 + 81 + 16 + 121 + 256}{5} = \frac{670}{5} = 134$.
> * Standar deviasi populasi: $\sigma = \sqrt{134} \approx 11.58$.
> * Karena diambil $n = 2$ sampel secara berulang **dengan pengembalian**, standar deviasi distribusi sampling rata-rata sampelnya adalah:
>   $$\sigma_{\bar{x}} = \frac{\sigma}{\sqrt{n}} = \frac{\sqrt{134}}{\sqrt{2}} = \sqrt{67} \approx 8.19$$

> **Pembahasan Tugas 3 (Soal 1: Estimasi Titik dari $n = 60$ Sampel):**
> Dari 60 data sampel yang diberikan, diperoleh $\sum x_i = 223.3$ dan $\sum x_i^2 = 947.07$.
> * **a. Mean sampel ($\bar{x}$):**
>   $$\bar{x} = \frac{223.3}{60} \approx 3.72$$
>   **Deviasi standar sampel ($s$):**
>   $$s = \sqrt{\frac{947.07 - \frac{(223.3)^2}{60}}{60 - 1}} = \sqrt{\frac{947.07 - 831.05}{59}} = \sqrt{1.9665} \approx 1.40$$
> * **b. Taksiran standar eror ($SE$):**
>   $$SE = \frac{s}{\sqrt{n}} = \frac{1.4023}{\sqrt{60}} \approx 0.18$$

---

## Bagian 3: Peubah Acak & Distribusi Peluang Diskret

### 3.1 Perbedaan Distribusi Peluang Diskret dan Kontinu (Tugas 2 Soal 1 & 2)

| Aspek Perbandingan | Distribusi Peluang Diskret | Distribusi Peluang Kontinu |
| :--- | :--- | :--- |
| **Asal Nilai Peubah Acak** | Hasil **menghitung/mencacah** (*countable*), nilai terpisah (bilangan bulat). | Hasil **mengukur** (*measurable*), nilai berada dalam suatu interval/selang tak hingga. |
| **Cara Menghitung Peluang** | Dihitung pada titik tepat $P(X = x)$ menggunakan fungsi massa peluang. | Peluang di satu titik tepat adalah $0$, sehingga dihitung sebagai luas kurva pada interval $P(a \le X \le b)$. |
| **Syarat Total Peluang** | $\sum P(X = x) = 1$ | $\int_{-\infty}^{\infty} f(x)\,dx = 1$ |
| **Contoh** | Jumlah mata dadu yang muncul ($2$ sampai $12$), jumlah produk cacat, Distribusi Binomial, Distribusi Poisson. | Tinggi badan, berat badan, lama waktu tunggu, Distribusi Normal, Distribusi $t$. |

**Ringkasan Tugas 1 (Soal 4):**
Untuk menghitung peluang kumulatif pada tabel distribusi diskret, cukup jumlahkan peluang masing-masing nilai $X$ yang memenuhi syarat:
* $P(X \le 5) = P(X=2) + P(X=3) + P(X=4) + P(X=5) = \frac{1}{36} + \frac{2}{36} + \frac{3}{36} + \frac{4}{36} = \frac{10}{36} \approx 0.2778$.
* $P(X > 8) = P(X=9) + P(X=10) + P(X=11) + P(X=12) = \frac{4}{36} + \frac{3}{36} + \frac{2}{36} + \frac{1}{36} = \frac{10}{36} \approx 0.2778$.

---

### 3.2 Distribusi Binomial
Digunakan jika percobaan diulang sebanyak $n$ kali secara independen dan setiap percobaan hanya memiliki **dua kemungkinan hasil** (Sukses dengan peluang $p$, dan Gagal dengan peluang $q = 1 - p$).
* **Rumus Peluang Binomial:**
  $$P(X = x) = \binom{n}{x} p^x q^{n-x}, \quad \text{dengan } \binom{n}{x} = \frac{n!}{x!(n-x)!}$$
* **Rata-rata & Simpangan Baku:**
  $$\mu = n \cdot p \quad \text{dan} \quad \sigma = \sqrt{n \cdot p \cdot q}$$

> **Pembahasan Tugas 1 (Soal 5):**
> Peluang produk rusak $p = 0.20$, tidak rusak $q = 0.80$, jumlah unit dibeli $n = 8$.
> * **a. Semua produk tidak rusak ($X = 0$ rusak):**
>   $$P(X = 0) = \binom{8}{0} (0.20)^0 (0.80)^8 = 1 \times 1 \times 0.16777 \approx 0.1678$$
> * **b. Tepat 5 unit rusak ($X = 5$):**
>   $$P(X = 5) = \binom{8}{5} (0.20)^5 (0.80)^3 = 56 \times 0.00032 \times 0.512 \approx 0.0092$$

---

### 3.3 Distribusi Poisson (Pendekatan Binomial untuk $n$ Besar & $p$ Kecil)
Jika $n$ sangat besar ($n \ge 50$) dan peluang kejadian $p$ sangat kecil ($p < 0.05$), perhitungan Binomial menjadi sulit dan dapat didekati dengan **Distribusi Poisson** menggunakan rata-rata kejadian $\lambda = n \cdot p$:
* **Rumus Peluang Poisson:**
  $$P(X = x) = \frac{e^{-\lambda} \lambda^x}{x!}, \quad \text{dengan } e \approx 2.71828$$
* **Rata-rata & Simpangan Baku Poisson:**
  $$\mu = \lambda \quad \text{dan} \quad \sigma = \sqrt{\lambda}$$

> **Pembahasan Tugas 2 (Soal 3):**
> Dari $5000$ sepatu terdapat $5$ cacat, sehingga $p = \frac{5}{5000} = 0.001$. Pesanan Mr. X sebanyak $n = 7000$, maka $\lambda = n \cdot p = 7000 \times 0.001 = 7$.
> * **a. Paling banyak 3 sepatu cacat ($P(X \le 3)$):**
>   $$P(X \le 3) = P(X=0) + P(X=1) + P(X=2) + P(X=3)$$
>   Dengan Poisson ($\lambda = 7$):
>   $$P(X \le 3) = e^{-7}\left(\frac{7^0}{0!} + \frac{7^1}{1!} + \frac{7^2}{2!} + \frac{7^3}{3!}\right) = 0.0009119 \times (1 + 7 + 24.5 + 57.1667) \approx 0.0818$$
>   *(Dengan rumus Binomial langsung hasilnya hampir sama, yakni $\approx 0.0817$).*
> * **b. Lebih dari 4 sepatu cacat ($P(X > 4)$):**
>   Gunakan aturan komplemen: $P(X > 4) = 1 - P(X \le 4)$.
>   Hitung $P(X = 4) = \frac{e^{-7} 7^4}{4!} \approx 0.0912$, sehingga $P(X \le 4) = 0.0818 + 0.0912 = 0.1730$.
>   Maka $P(X > 4) = 1 - 0.1730 = 0.8270$.
> * **c. Rata-rata dan Simpangan Baku:**
>   * Pendekatan Poisson: $\mu = \lambda = 7$ dan $\sigma = \sqrt{7} \approx 2.646$.
>   * Pendekatan Binomial: $\mu = np = 7$ dan $\sigma = \sqrt{7000 \times 0.001 \times 0.999} \approx 2.644$.

---

## Bagian 4: Distribusi Normal & Koreksi Kontinuitas

### 4.1 Transformasi Skor Baku $Z$
Untuk mencari peluang pada distribusi normal dengan rata-rata $\mu$ dan simpangan baku $\sigma$, ubah nilai $X$ menjadi nilai baku $Z$ lalu baca luasnya pada **Tabel Distribusi Normal Baku ($Z$)**:
$$Z = \frac{X - \mu}{\sigma}$$

### 4.2 Pendekatan Distribusi Normal terhadap Binomial
Jika $n$ besar dan $p$ tidak terlalu dekat dengan $0$ atau $1$ (syarat: $n \cdot p \ge 5$ dan $n \cdot q \ge 5$), distribusi Binomial dapat didekati dengan Distribusi Normal dengan:
$$\mu = n \cdot p \quad \text{dan} \quad \sigma = \sqrt{n \cdot p \cdot q}$$

**Aturan Wajib — Koreksi Kontinuitas ($\pm 0.5$):**
Karena mengubah variabel diskret menjadi kontinu, batas bilangan bulat $x$ harus dikoreksi sebesar $0.5$:
* $P(X = x) \rightarrow P(x - 0.5 \le X \le x + 0.5)$
* $P(X \le x) \rightarrow P(X \le x + 0.5)$
* $P(X < x) \rightarrow P(X \le x - 0.5)$
* $P(X \ge x) \rightarrow P(X \ge x - 0.5)$
* $P(X > x) \rightarrow P(X \ge x + 0.5)$
* $P(a \le X \le b) \rightarrow P(a - 0.5 \le X \le b + 0.5)$

> **Pembahasan Tugas 2 (Soal 4):**
> * **Langkah 1 (Identifikasi Parameter):** Total ujian 500 soal, tetapi yang dijawab secara acak hanya **$n = 230$** soal! Peluang menjawab benar 1 dari 5 pilihan adalah $p = \frac{1}{5} = 0.2$, dan $q = 0.8$.
> * **Langkah 2 (Hitung $\mu$ dan $\sigma$):**
>   $$\mu = np = 230 \times 0.2 = 46$$
>   $$\sigma = \sqrt{npq} = \sqrt{230 \times 0.2 \times 0.8} = \sqrt{36.8} \approx 6.066$$
> * **Langkah 3 (Koreksi Kontinuitas):** Peluang mendapat dari $45$ sampai $70$ jawaban benar:
>   $$P(45 \le X \le 70) \xrightarrow{\text{koreksi}} P(44.5 \le X \le 70.5)$$
> * **Langkah 4 (Transformasi ke $Z$):**
>   $$Z_1 = \frac{44.5 - 46}{6.066} = -0.25 \quad \text{dan} \quad Z_2 = \frac{70.5 - 46}{6.066} = 4.04$$
> * **Langkah 5 (Baca Tabel Normal Baku):**
>   $$P(-0.25 \le Z \le 4.04) = P(Z \le 4.04) - P(Z \le -0.25) = 1.0000 - 0.4013 = 0.5987$$

---

## Bagian 5: Pengujian Hipotesis

### 5.1 Menentukan Arah Pengujian & Statistik Uji
1. **Arah Pengujian (Dilihat dari Hipotesis Alternatif $H_1$):**
   * **Uji Dua Arah (*Two-Tailed*):** Menggunakan tanda $\ne$ (kata kunci: *"berbeda"*, *"tidak sama dengan"*, *"berubah"*). Nilai $\alpha$ dibagi dua menjadi $\alpha / 2$.
   * **Uji Satu Arah Sisi Kanan:** Menggunakan tanda $>$ (kata kunci: *"lebih besar"*, *"meningkat"*, *"lebih tinggi"*).
   * **Uji Satu Arah Sisi Kiri:** Menggunakan tanda $<$ (kata kunci: *"lebih kecil"*, *"menurun"*, *"lebih rendah"*).

2. **Memilih Rumus Statistik Uji:**
   * **Uji $Z$ Satu Sampel** ($\sigma$ populasi diketahui, atau sampel besar $n \ge 30$):
     $$Z_{\text{hitung}} = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$
   * **Uji $t$ Satu Sampel** ($\sigma$ populasi tidak diketahui dan sampel kecil $n < 30$, $db = n - 1$):
     $$t_{\text{hitung}} = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$
   * **Uji $t$ Dua Sampel Berpasangan (*Paired t-Test*)** (data *sebelum* dan *sesudah* pada objek yang sama, $db = n - 1$):
     $$t_{\text{hitung}} = \frac{\bar{d} - \mu_{d0}}{s_d / \sqrt{n}}$$
     *(dengan $d_i = x_{\text{sebelum}} - x_{\text{sesudah}}$, $\bar{d} = \frac{\sum d_i}{n}$, dan $s_d = \sqrt{\frac{\sum d_i^2 - \frac{(\sum d_i)^2}{n}}{n - 1}}$)*

---

### 5.2 Pembahasan Tugas 3 (Soal 2 & Soal 3)

#### Pembahasan Soal 2 (Uji $Z$ Satu Sampel Dua Arah)
Diketahui: $\mu_0 = 80\text{ cm}$, $\sigma = 7\text{ cm}$, $n = 100$, $\bar{x} = 83\text{ cm}$, $\alpha = 5\% = 0.05$.
* **a. Jenis Uji:** Menggunakan **Uji $Z$ satu sampel dua arah**, karena simpangan baku populasi ($\sigma$) diketahui, sampel besar ($n = 100$), dan teknisi menduga rata-rata panjang *"tidak sama dengan"* $80\text{ cm}$.
* **b. Hipotesis:**
  * $H_0: \mu = 80$
  * $H_1: \mu \ne 80$
* **c. Statistik Uji:**
  $$Z_{\text{hitung}} = \frac{83 - 80}{7 / \sqrt{100}} = \frac{3}{0.7} \approx 4.29$$
* **d. Daerah Kritik:**
  Untuk uji dua arah dengan $\alpha = 0.05$ ($\alpha / 2 = 0.025$), diperoleh $Z_{\text{tabel}} = \pm 1.96$. Daerah penolakan $H_0$ adalah $Z_{\text{hitung}} < -1.96$ atau $Z_{\text{hitung}} > 1.96$.
* **e. Kesimpulan:**
  Karena $Z_{\text{hitung}} = 4.29 > 1.96$, maka **$H_0$ ditolak**. Rata-rata panjang pelat baja secara signifikan sudah tidak sama dengan $80\text{ cm}$.

#### Pembahasan Soal 3 (Uji $t$ Sampel Berpasangan — Satu Arah)
Diketahui $n = 12$ pasien ($db = 11$) dan $\alpha = 0.05$. Definisikan selisih $d_i = \text{Sebelum} - \text{Sesudah}$:
* Data selisih ($d_i$): $30, 36, 30, 42, 0, 25, 17, 28, -5, 6, 5, 20$.
* Jumlah selisih: $\sum d_i = 234 \rightarrow \bar{d} = \frac{234}{12} = 19.5$.
* Jumlah kuadrat selisih: $\sum d_i^2 = 7044$.
* Standar deviasi selisih ($s_d$):
  $$s_d = \sqrt{\frac{7044 - \frac{234^2}{12}}{11}} = \sqrt{\frac{7044 - 4563}{11}} = \sqrt{225.5455} \approx 15.018$$
* **Hipotesis:** Jika obat menurunkan tekanan darah, maka $\text{Sebelum} > \text{Sesudah}$ ($\mu_d > 0$):
  * $H_0: \mu_d = 0$
  * $H_1: \mu_d > 0$ *(uji satu arah sisi kanan)*
* **Statistik Uji:**
  $$t_{\text{hitung}} = \frac{19.5}{15.018 / \sqrt{12}} = \frac{19.5}{4.335} \approx 4.50$$
* **Daerah Kritik:**
  Dari tabel distribusi $t$ dengan $db = 11$ dan $\alpha = 0.05$ (satu arah), diperoleh $t_{\text{tabel}} = 1.796$.
* **Kesimpulan:**
  Karena $t_{\text{hitung}} = 4.50 > 1.796$, maka **$H_0$ ditolak**. Pemberian obat Amlodipine Besylate dosis 5 mg terbukti secara signifikan dapat menurunkan tekanan darah sistolik pasien.