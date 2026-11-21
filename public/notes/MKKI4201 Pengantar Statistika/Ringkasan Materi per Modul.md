# Materi Persiapan UAS: Pengantar Statistika (MKKI4201)

---

## Modul 1: Pengertian Statistika dan Klasifikasinya

- **Konsep Dasar**
  - **Statistik**: Kumpulan angka atau ringkasan numerik yang dihitung dari data sampel (contoh: rata-rata sampel $\bar{x}$, proporsi sampel $\hat{p}$).
  - **Statistika**: Ilmu pengetahuan yang mempelajari metode pengumpulan, pengolahan, penyajian, analisis, dan penarikan kesimpulan dari data.
  - **Populasi vs. Sampel**: Populasi adalah keseluruhan objek penelitian (ukurannya disebut **parameter**, seperti $\mu, \sigma, p$), sedangkan sampel adalah sebagian dari populasi yang diamati (ukurannya disebut **statistik**).
- **Klasifikasi Statistika**
  - **Statistika Deskriptif**: Metode yang berkaitan dengan pengumpulan, peringkasan, dan penyajian data tanpa melakukan generalisasi ke populasi.
  - **Statistika Inferensia**: Metode untuk menarik kesimpulan atau membuat keputusan mengenai parameter populasi berdasarkan informasi dari sampel (meliputi pendugaan parameter dan pengujian hipotesis).
- **Jenis Data dan Skala Pengukuran**
  - **Data Kualitatif (Kategorik)**: Data berbentuk kategori atau atribut (contoh: jenis kelamin, status kelulusan).
  - **Data Kuantitatif (Numerik)**:
    - *Diskret*: Diperoleh dari hasil membilang/menghitung, bernilai bulat (contoh: jumlah anak, jumlah produk cacat).
    - *Kontinu*: Diperoleh dari hasil mengukur, dapat bernilai pecahan dalam suatu selang (contoh: tinggi badan, berat, waktu).
  - **Empat Skala Pengukuran**:
    - *Nominal*: Hanya sebagai label/pembeda tanpa urutan (contoh: agama, kode pos).
    - *Ordinal*: Memiliki urutan/tingkatan, tetapi jarak antar kategori tidak sama/tidak dapat diukur (contoh: tingkat kepuasan, peringkat juara).
    - *Interval*: Memiliki urutan dan jarak yang sama, tetapi tidak memiliki titik nol mutlak (contoh: suhu dalam Celcius, tahun).
    - *Rasio*: Memiliki semua sifat interval ditambah titik nol mutlak sehingga dapat dibandingkan secara kelipatan (contoh: pendapatan, berat badan, umur).
- **Teknik Penarikan Sampel (Sampling)**
  - **Probability Sampling**: Setiap anggota populasi memiliki peluang yang diketahui dan bukan nol untuk terpilih.
    - *Simple Random Sampling* (acak sederhana).
    - *Stratified Random Sampling* (acak berlapis: populasi dibagi ke dalam strata yang homogen).
    - *Systematic Sampling* (sistematis: memilih setiap elemen ke-$k$).
    - *Cluster Sampling* (acak klaster: memilih kelompok/wilayah secara acak).
  - **Non-Probability Sampling**: Pemilihan sampel tidak berdasarkan peluang acak (contoh: *purposive sampling*, *convenience sampling*, *quota sampling*).

---

## Modul 2: Statistika Deskriptif

- **Penyajian Data**
  - **Data Kategorik**: Tabel frekuensi, diagram batang (*bar chart*), diagram lingkaran (*pie chart*).
  - **Data Numerik**: Tabel distribusi frekuensi berkelompok, histogram, poligon frekuensi, *ogive* (frekuensi kumulatif), diagram dahan-daun (*stem-and-leaf*), dan *boxplot*.
- **Ukuran Pemusatan Data**
  - **Mean (Rata-rata Hitung)**:
    - Data tunggal sampel:
      $$\bar{x} = \frac{\sum_{i=1}^{n} x_i}{n}$$
    - Data berkelompok:
      $$\bar{x} = \frac{\sum_{i=1}^{k} f_i x_i}{\sum_{i=1}^{k} f_i}$$
    - Sifat: Peka terhadap nilai pencilan (*outlier*).
  - **Median ($Me$)**: Nilai tengah setelah data diurutkan; tahan terhadap *outlier* (cocok untuk data menjulur/menceng).
    - Data berkelompok:
      $$Me = L_{Me} + \left( \frac{\frac{n}{2} - F_{k}}{f_{Me}} \right) c$$
  - **Modus ($Mo$)**: Nilai atau kelas yang paling sering muncul (frekuensi tertinggi).
    - Data berkelompok:
      $$Mo = L_{Mo} + \left( \frac{d_1}{d_1 + d_2} \right) c$$
- **Ukuran Letak Data**
  - **Kuartil ($Q_1, Q_2, Q_3$)**: Membagi data terurut menjadi 4 bagian sama besar ($Q_2 = Me$).
  - **Desil ($D_1, \dots, D_9$)**: Membagi data terurut menjadi 10 bagian sama besar.
  - **Persentil ($P_1, \dots, P_{99}$)**: Membagi data terurut menjadi 100 bagian sama besar.
- **Ukuran Penyebaran (Keragaman) Data**
  - **Jangkauan (*Range*)**: $R = x_{\max} - x_{\min}$
  - **Jangkauan Antarkuartil (*Interquartile Range*)**: $IQR = Q_3 - Q_1$
  - **Varians dan Simpangan Baku**:
    - Varians sampel ($s^2$):
      $$s^2 = \frac{\sum_{i=1}^{n} (x_i - \bar{x})^2}{n - 1}$$
    - Simpangan baku sampel: $s = \sqrt{s^2}$
    - Varians populasi ($\sigma^2$):
      $$\sigma^2 = \frac{\sum_{i=1}^{N} (x_i - \mu)^2}{N}$$
  - **Koefisien Variasi ($KV$)**: Mengukur keragaman relatif antar gugus data berbeda satuan:
    $$KV = \frac{s}{\bar{x}} \times 100\%$$
- **Bentuk Distribusi**
  - **Simetris**: $\bar{x} = Me = Mo$.
  - **Menjulur ke Kanan (*Positive Skew*)**: Ekor memanjang ke kanan, $\bar{x} > Me > Mo$.
  - **Menjulur ke Kiri (*Negative Skew*)**: Ekor memanjang ke kiri, $\bar{x} < Me < Mo$.

---

## Modul 3: Konsep Dasar Peluang

- **Ruang Sampel dan Kejadian**
  - **Ruang Sampel ($S$)**: Himpunan semua hasil yang mungkin dari suatu percobaan acak.
  - **Kejadian ($A$)**: Himpunan bagian dari ruang sampel $S$.
  - **Peluang Klasik**: Jika semua titik sampel berpeluang sama, maka $P(A) = \frac{n(A)}{n(S)}$.
- **Kaidah Pencacahan**
  - **Aturan Perkalian**: Jika tahap 1 dapat dilakukan dalam $n_1$ cara dan tahap 2 dalam $n_2$ cara, total cara adalah $n_1 \times n_2$.
  - **Permutasi (Memperhatikan Urutan)**:
    $$P^{n}_{r} = \frac{n!}{(n - r)!}$$
  - **Kombinasi (Tidak Memperhatikan Urutan)**:
    $$C^{n}_{r} = \binom{n}{r} = \frac{n!}{r!(n - r)!}$$
- **Aksioma dan Aturan Peluang**
  - **Aksioma Dasar**: $0 \le P(A) \le 1$, $P(S) = 1$, dan $P(\emptyset) = 0$.
  - **Aturan Komplemen**: $P(A^c) = 1 - P(A)$.
  - **Aturan Penjumlahan**:
    $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
    - Jika $A$ dan $B$ **saling lepas** (*mutually exclusive*), maka $P(A \cap B) = 0$, sehingga $P(A \cup B) = P(A) + P(B)$.
  - **Peluang Bersyarat**: Peluang terjadinya $A$ jika diketahui $B$ telah terjadi ($P(B) > 0$):
    $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$
  - **Kejadian Saling Bebas (*Independent*)**: Terjadinya $A$ tidak memengaruhi peluang $B$:
    $$P(A \cap B) = P(A) \cdot P(B) \quad \text{atau} \quad P(A \mid B) = P(A)$$
  - **Teorema Bayes**:
    $$P(B_i \mid A) = \frac{P(B_i) P(A \mid B_i)}{\sum_{j=1}^{k} P(B_j) P(A \mid B_j)}$$

---

## Modul 4: Variabel Acak dan Distribusi Peluang

- **Variabel Acak ($X$)**
  - Fungsi yang memetakan setiap elemen di ruang sampel $S$ ke bilangan riil.
  - **Variabel Acak Diskret**: Nilai-nilainya terhitung (*countable*).
  - **Variabel Acak Kontinu**: Nilai-nilainya berada dalam suatu selang bilangan riil (*uncountable*).
- **Fungsi Peluang Diskret**
  - **Fungsi Massa Peluang (PMF)**: $p(x) = P(X = x)$ dengan syarat $p(x) \ge 0$ dan $\sum_{x} p(x) = 1$.
  - **Fungsi Distribusi Kumulatif (CDF)**: $F(x) = P(X \le x) = \sum_{t \le x} p(t)$.
- **Fungsi Peluang Kontinu**
  - **Fungsi Kepadatan Peluang (PDF)**: $f(x)$ dengan syarat $f(x) \ge 0$ dan $\int_{-\infty}^{\infty} f(x)\,dx = 1$.
  - **Peluang pada Selang**: $P(a \le X \le b) = \int_{a}^{b} f(x)\,dx$, serta $P(X = c) = 0$ untuk setiap konstanta $c$.
- **Nilai Harapan (Ekspektasi) dan Varians**
  - **Nilai Harapan $\mu = E(X)$**:
    - Diskret: $E(X) = \sum_{x} x \, p(x)$
    - Kontinu: $E(X) = \int_{-\infty}^{\infty} x \, f(x)\,dx$
  - **Varians $\sigma^2 = \text{Var}(X)$**:
    $$\text{Var}(X) = E\left[(X - \mu)^2\right] = E(X^2) - [E(X)]^2$$
  - **Sifat Linearitas**: $E(aX + b) = aE(X) + b$ dan $\text{Var}(aX + b) = a^2 \text{Var}(X)$.

---

## Modul 5: Distribusi Peluang Diskret

- **Distribusi Seragam Diskret**
  - Setiap $k$ nilai memiliki peluang yang sama: $p(x) = \frac{1}{k}$.
- **Distribusi Bernoulli dan Binomial**
  - **Syarat Percobaan Binomial**:
    - Terdiri atas $n$ ulangan yang saling bebas.
    - Setiap ulangan hanya menghasilkan 2 kejadian: "sukses" (peluang $p$) atau "gagal" (peluang $q = 1 - p$).
    - Peluang sukses $p$ konstan pada setiap ulangan.
  - **Rumus PMF Binomial** ($X \sim \text{Bin}(n, p)$):
    $$P(X = x) = \binom{n}{x} p^x (1 - p)^{n - x}, \quad x = 0, 1, 2, \dots, n$$
  - **Parameter**: $\mu = np$ dan $\sigma^2 = np(1 - p)$.
- **Distribusi Hipergeometrik**
  - Digunakan untuk penarikan sampel ukuran $n$ **tanpa pengembalian** dari populasi berukuran $N$ yang memuat $K$ unsur sukses:
    $$P(X = x) = \frac{\binom{K}{x} \binom{N - K}{n - x}}{\binom{N}{n}}$$
  - **Parameter**: $\mu = n \frac{K}{N}$.
- **Distribusi Poisson**
  - Memodelkan banyaknya kejadian sukses dalam selang waktu atau ruang tertentu dengan rata-rata kejadian $\lambda$:
    $$P(X = x) = \frac{e^{-\lambda} \lambda^x}{x!}, \quad x = 0, 1, 2, \dots$$
  - **Parameter**: $\mu = \lambda$ dan $\sigma^2 = \lambda$.
  - **Pendekatan Poisson terhadap Binomial**: Digunakan saat $n$ besar ($n \ge 20$) dan $p$ sangat kecil ($p \le 0{,}05$) dengan $\lambda = np$.

---

## Modul 6: Distribusi Peluang Kontinu

- **Distribusi Seragam Kontinu**
  - Pada selang $[a, b]$: $f(x) = \frac{1}{b - a}$ untuk $a \le x \le b$.
  - **Parameter**: $\mu = \frac{a + b}{2}$ dan $\sigma^2 = \frac{(b - a)^2}{12}$.
- **Distribusi Normal**
  - Kurva berbentuk lonceng simetris terhadap $\mu$, ditentukan oleh rata-rata $\mu$ dan simpangan baku $\sigma$, ditulis $X \sim N(\mu, \sigma^2)$.
  - **Aturan Empiris (68-95-99,7)**:
    - Sekitar $68\%$ data berada dalam $\mu \pm 1\sigma$.
    - Sekitar $95\%$ data berada dalam $\mu \pm 2\sigma$.
    - Sekitar $99{,}7\%$ data berada dalam $\mu \pm 3\sigma$.
  - **Distribusi Normal Baku ($Z \sim N(0, 1)$)**:
    $$Z = \frac{X - \mu}{\sigma}$$
- **Pendekatan Normal terhadap Binomial**
  - Berlaku jika $np \ge 5$ dan $n(1 - p) \ge 5$, dengan $\mu = np$ dan $\sigma = \sqrt{np(1 - p)}$.
  - Menggunakan **koreksi kekontinuan** ($\pm 0{,}5$): misalnya $P(X \le x)$ didekati dengan $P\left(Z \le \frac{x + 0{,}5 - np}{\sqrt{np(1 - p)}}\right)$.
- **Distribusi Penarikan Sampel (*Sampling Distributions*)**
  - **Teorema Limit Pusat (CLT)**: Untuk sampel acak berukuran besar ($n \ge 30$), distribusi rata-rata sampel $\bar{X}$ mendekati distribusi Normal dengan $\mu_{\bar{X}} = \mu$ dan $\sigma_{\bar{X}} = \frac{\sigma}{\sqrt{n}}$.
  - **Distribusi Lainnya**: Distribusi Eksponensial, Distribusi $t$-Student (derajat bebas $db = n - 1$), Distribusi Chi-Kuadrat ($\chi^2$), dan Distribusi $F$.

---

## Modul 7: Statistika Inferensia (Pendugaan Parameter)

- **Pendugaan Titik**
  - Menggunakan satu nilai statistik sampel untuk menduga parameter populasi (contoh: $\bar{x}$ menduga $\mu$, $s^2$ menduga $\sigma^2$, $\hat{p}$ menduga $p$).
  - Kriteria penduga yang baik: **tak bias** ($E(\hat{\theta}) = \theta$), **efisien** (varians terkecil), dan **konsisten**.
- **Selang Kepercayaan (Confidence Interval / CI) Satu Populasi**
  - **Selang Kepercayaan $(1 - \alpha)100\%$ untuk Rata-rata $\mu$**:
    - Kasus 1: $\sigma$ diketahui (atau sampel besar $n \ge 30$ menggunakan $s$ sebagai pengganti $\sigma$):
      $$\bar{x} - z_{\alpha/2} \frac{\sigma}{\sqrt{n}} < \mu < \bar{x} + z_{\alpha/2} \frac{\sigma}{\sqrt{n}}$$
    - Kasus 2: $\sigma$ tidak diketahui dan sampel kecil ($n < 30$) dari populasi normal:
      $$\bar{x} - t_{\alpha/2;\, db=n-1} \frac{s}{\sqrt{n}} < \mu < \bar{x} + t_{\alpha/2;\, db=n-1} \frac{s}{\sqrt{n}}$$
  - **Selang Kepercayaan $(1 - \alpha)100\%$ untuk Proporsi $p$** ($\hat{p} = x/n$):
    $$\hat{p} - z_{\alpha/2} \sqrt{\frac{\hat{p}(1 - \hat{p})}{n}} < p < \hat{p} + z_{\alpha/2} \sqrt{\frac{\hat{p}(1 - \hat{p})}{n}}$$
- **Selang Kepercayaan Dua Populasi**
  - **Selisih Dua Rata-rata ($\mu_1 - \mu_2$)** (sampel bebas, $\sigma_1, \sigma_2$ diketahui):
    $$(\bar{x}_1 - \bar{x}_2) \pm z_{\alpha/2} \sqrt{\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}}$$
  - **Selisih Dua Proporsi ($p_1 - p_2$)**:
    $$(\hat{p}_1 - \hat{p}_2) \pm z_{\alpha/2} \sqrt{\frac{\hat{p}_1(1 - \hat{p}_1)}{n_1} + \frac{\hat{p}_2(1 - \hat{p}_2)}{n_2}}$$
- **Menentukan Ukuran Sampel Minimum ($n$)**
  - Dengan batas galat pendugaan (*margin of error*) maksimum $E$:
    - Untuk rata-rata: $n = \left( \frac{z_{\alpha/2} \cdot \sigma}{E} \right)^2$ (selalu dibulatkan ke atas).
    - Untuk proporsi: $n = \frac{z_{\alpha/2}^2 \, \hat{p}(1 - \hat{p})}{E^2}$ (jika $\hat{p}$ tidak diketahui, gunakan $\hat{p} = 0{,}5$).

---

## Modul 8: Pengujian Hipotesis untuk Satu Populasi

- **Konsep Dasar Pengujian Hipotesis**
  - **Hipotesis Nol ($H_0$)**: Pernyataan awal yang mengandung tanda kesamaan ($=, \le, \ge$) dan akan diuji kebenarannya.
  - **Hipotesis Alternatif ($H_1$)**: Pernyataan tandingan yang ingin dibuktikan:
    - Uji dua arah (*two-tailed*): $H_1: \theta \ne \theta_0$
    - Uji satu arah kanan (*right-tailed*): $H_1: \theta > \theta_0$
    - Uji satu arah kiri (*left-tailed*): $H_1: \theta < \theta_0$
  - **Jenis Kesalahan**:
    - *Galat Tipe I ($\alpha$)*: Menolak $H_0$ padahal $H_0$ benar (taraf signifikansi).
    - *Galat Tipe II ($\beta$)*: Gagal menolak $H_0$ padahal $H_0$ salah.
  - **Aturan Keputusan**: Tolak $H_0$ jika statistik uji jatuh di daerah kritis atau jika $\text{p-value} \le \alpha$.
- **Uji Hipotesis Rata-rata Satu Populasi ($H_0: \mu = \mu_0$)**
  - **$\sigma$ Diketahui (atau $n \ge 30$) — Uji-$Z$**:
    $$Z_{\text{hitung}} = \frac{\bar{x} - \mu_0}{\sigma / \sqrt{n}}$$
  - **$\sigma$ Tidak Diketahui ($n < 30$) — Uji-$t$** ($db = n - 1$):
    $$t_{\text{hitung}} = \frac{\bar{x} - \mu_0}{s / \sqrt{n}}$$
- **Uji Hipotesis Proporsi Satu Populasi ($H_0: p = p_0$)**
  - **Statistik Uji-$Z$**:
    $$Z_{\text{hitung}} = \frac{\hat{p} - p_0}{\sqrt{\frac{p_0(1 - p_0)}{n}}}$$
- **Uji Hipotesis Varians Satu Populasi ($H_0: \sigma^2 = \sigma_0^2$)**
  - **Statistik Uji Chi-Kuadrat ($\chi^2$)** ($db = n - 1$):
    $$\chi^2_{\text{hitung}} = \frac{(n - 1)s^2}{\sigma_0^2}$$

---

## Modul 9: Pengujian Hipotesis untuk Dua Populasi

- **Uji Selisih Dua Rata-rata ($H_0: \mu_1 - \mu_2 = d_0$)**
  - **Dua Sampel Bebas, $\sigma_1$ dan $\sigma_2$ Diketahui — Uji-$Z$**:
    $$Z_{\text{hitung}} = \frac{(\bar{x}_1 - \bar{x}_2) - d_0}{\sqrt{\frac{\sigma_1^2}{n_1} + \frac{\sigma_2^2}{n_2}}}$$
  - **Dua Sampel Bebas, $\sigma_1 = \sigma_2$ Tidak Diketahui — Uji-$t$ Gabungan (*Pooled*)**:
    $$t_{\text{hitung}} = \frac{(\bar{x}_1 - \bar{x}_2) - d_0}{s_p \sqrt{\frac{1}{n_1} + \frac{1}{n_2}}}, \quad \text{dengan } s_p^2 = \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2}$$
    - Derajat bebas: $db = n_1 + n_2 - 2$.
  - **Dua Sampel Bebas, $\sigma_1 \ne \sigma_2$ Tidak Diketahui — Uji-$t$ Welch**:
    $$t_{\text{hitung}} = \frac{(\bar{x}_1 - \bar{x}_2) - d_0}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$
  - **Dua Sampel Berpasangan (*Paired Sample*) — Uji-$t$ Berpasangan** ($d_i = x_{1i} - x_{2i}$, $db = n - 1$):
    $$t_{\text{hitung}} = \frac{\bar{d} - d_0}{s_d / \sqrt{n}}$$
- **Uji Selisih Dua Proporsi ($H_0: p_1 - p_2 = 0$)**
  - Menggunakan proporsi gabungan $\hat{p} = \frac{x_1 + x_2}{n_1 + n_2}$:
    $$Z_{\text{hitung}} = \frac{\hat{p}_1 - \hat{p}_2}{\sqrt{\hat{p}(1 - \hat{p}) \left(\frac{1}{n_1} + \frac{1}{n_2}\right)}}$$
- **Uji Rasio Dua Varians ($H_0: \sigma_1^2 = \sigma_2^2$)**
  - **Statistik Uji-$F$** ($db_1 = n_1 - 1$, $db_2 = n_2 - 1$):
    $$F_{\text{hitung}} = \frac{s_1^2}{s_2^2}$$