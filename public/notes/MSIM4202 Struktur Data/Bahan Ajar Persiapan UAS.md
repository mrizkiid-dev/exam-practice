# Bahan Ajar Persiapan UAS: Struktur Data (Java)

Dokumen ini berisi ringkasan konsep inti, implementasi kode Java, analisis kompleksitas, serta simulasi *tracing* berdasarkan rangkaian Tugas Praktik 1 hingga 3 sebagai bahan persiapan Ujian Akhir Semester (UAS).

---

## Modul 1: Variabel, Array, dan Linked List

Materi ini menguji pemahaman dasar penyimpanan data di memori serta sintaks deklarasi di bahasa pemrograman Java.

### 1. Deklarasi Variabel (Primitif vs Objek)
* **Tipe Primitif (`int`):** Menyimpan nilai secara langsung di memori *stack*.
  * Contoh deklarasi: `int strukturBaris;`
  * Contoh inisialisasi: `int strukturBaris = 10;`
* **Tipe Objek/Referensi (`String`):** Menyimpan alamat referensi yang menunjuk ke objek teks di memori *heap* (diawali huruf kapital).
  * Contoh: `String kataBaru = "Muhammad";`

### 2. Array 1 Dimensi dan 2 Dimensi
Array menyimpan sekumpulan data bertipe sama secara berurutan di memori (*contiguous*) dengan ukuran tetap (*fixed size*). Indeks array selalu dimulai dari **`0`**.

```java
// 1. Array 1 Dimensi (4 elemen: indeks 0 sampai 3)
int[] empatAngka = {5, 10, 20, 82};
// Mengakses elemen terakhir: empatAngka[3] -> bernilai 82

// 2. Array 2 Dimensi (3 baris x 3 kolom)
String[][] angka = {
    {"05", "3", "5"},    // Baris 0
    {"14", "19", "20"},  // Baris 1
    {"22", "27", "82"}   // Baris 2
};
// Format akses: namaArray[indeksBaris][indeksKolom]
// angka[1][2] -> bernilai "20" (Baris ke-2, Kolom ke-3)
```

### 3. Linked List
Berbeda dengan array, **Linked List** menyimpan elemen dalam bentuk *Node* yang tersebar di memori secara dinamis. Setiap *node* berisi **data** dan **pointer (referensi)** yang menunjuk ke *node* berikutnya (serta *node* sebelumnya pada implementasi *Doubly Linked List* milik `java.util.LinkedList`).

```java
import java.util.LinkedList;

public class ContohLinkedList {
    public static void main(String[] args) {
        LinkedList<Integer> listAngka = new LinkedList<>();
        listAngka.add(5);
        listAngka.add(19);
        listAngka.add(44);
        listAngka.addFirst(1);  // Menyisipkan di awal: O(1)
        listAngka.removeLast(); // Menghapus elemen terakhir
    }
}
```

### 4. Perbandingan Array vs Linked List

| Aspek | Array | Linked List |
| :--- | :--- | :--- |
| **Ukuran** | Tetap (*static*), ditentukan saat dibuat | Dinamis, bertambah/berkurang otomatis |
| **Alokasi Memori** | Bersebelahan (*contiguous*) | Tersebar, dihubungkan oleh *pointer* |
| **Akses Elemen (`get`)** | Sangat cepat — $O(1)$ via indeks | Lambat — $O(n)$, harus telusuri dari awal |
| **Sisip/Hapus di Awal** | Lambat — $O(n)$, perlu menggeser elemen | Sangat cepat — $O(1)$, cukup ubah *pointer* |

---

## Modul 2: Algoritma Pengurutan (Merge Sort & Counting Sort)

Pada soal ujian, perhatikan dengan teliti arah pengurutan yang diminta: **Ascending** (terkecil ke terbesar) atau **Descending** (terbesar ke terkecil).

### 1. Merge Sort (*Divide and Conquer*)
Merge Sort bekerja dengan memecah array menjadi dua bagian secara rekursif hingga tersisa 1 elemen (*divide*), lalu menggabungkannya kembali secara berurutan (*merge*).

* **Kunci Logika Descending (Terbesar ke Terkecil):** Saat membandingkan sub-array kiri (`L`) dan kanan (`R`), masukkan elemen yang **lebih besar** terlebih dahulu ke array utama (`L[i] >= R[j]`).

```java
void mergeSortDescending(int[] arr, int left, int right) {
    if (left < right) {
        int mid = left + (right - left) / 2;
        mergeSortDescending(arr, left, mid);
        mergeSortDescending(arr, mid + 1, right);
        mergeDescending(arr, left, mid, right);
    }
}

void mergeDescending(int[] arr, int left, int mid, int right) {
    int n1 = mid - left + 1;
    int n2 = right - mid;
    int[] L = new int[n1];
    int[] R = new int[n2];

    for (int i = 0; i < n1; i++) L[i] = arr[left + i];
    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

    int i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        // Tanda >= memastikan urutan dari BESAR ke KECIL
        if (L[i] >= R[j]) {
            arr[k++] = L[i++];
        } else {
            arr[k++] = R[j++];
        }
    }
    while (i < n1) arr[k++] = L[i++];
    while (j < n2) arr[k++] = R[j++];
}
```

### 2. Counting Sort (*Non-Comparison Sort*)
Counting Sort tidak membandingkan nilai antar elemen, melainkan menghitung **frekuensi kemunculan** setiap angka menggunakan array pembantu (`count`).

* **Langkah Kerja Descending:**
  1. Cari nilai maksimum ($k$) dalam array input.
  2. Buat array `count` berukuran $k + 1$, lalu hitung frekuensi setiap angka (`count[angka]++`).
  3. Iterasi array `count` dari indeks terbesar ($k$) turun ke $0$ untuk menyusun hasil dari terbesar ke terkecil.

```java
void countingSortDescending(int[] arr) {
    int max = arr[0];
    for (int num : arr) {
        if (num > max) max = num;
    }

    int[] count = new int[max + 1];
    for (int num : arr) {
        count[num]++; // Hitung frekuensi kemunculan
    }

    int index = 0;
    // Iterasi mundur dari max ke 0 untuk urutan Descending
    for (int i = max; i >= 0; i--) {
        while (count[i] > 0) {
            arr[index++] = i;
            count[i]--;
        }
    }
}
```

### 3. Analisis Kinerja Kedua Algoritma

| Kriteria | Merge Sort | Counting Sort |
| :--- | :--- | :--- |
| **Time Complexity (Best/Avg/Worst)** | $O(n \log n)$ di semua kasus | $O(n + k)$ di semua kasus ($k$ = nilai maks) |
| **Space Complexity** | $O(n)$ (butuh array sementara `L` dan `R`) | $O(n + k)$ (butuh array frekuensi `count`) |
| **Sifat Stabilitas** | *Stable* (posisi nilai kembar tidak tertukar) | *Stable* (jika memakai *cumulative count*) |
| **Kelebihan Utama** | Kinerja konsisten untuk data besar & tipe data apa pun | Lebih cepat dari $O(n \log n)$ jika rentang nilai $k$ kecil |
| **Kelemahan Utama** | Membutuhkan memori tambahan sebesar $O(n)$ | Hanya untuk bilangan bulat; boros memori jika $k \gg n$ |

---

## Modul 3: Graf dan Algoritma Pencarian (DFS vs BFS)

Graf terdiri dari sekumpulan simpul (**Vertex / $V$**) dan garis penghubung (**Edge / $E$**). Di Java, graf umumnya direpresentasikan menggunakan **Adjacency List** (`Map<String, List<String>>`).

### 1. Depth-First Search (DFS)
DFS menelusuri satu cabang **sedalam mungkin** hingga mencapai ujung (*dead end*), lalu melakukan *backtracking* (mundur) ke percabangan terakhir yang belum dikunjungi.
* **Struktur Data:** **Stack** (LIFO — *Last-In, First-Out*) atau menggunakan **Rekursi**.
* **Peran `visited`:** Menyimpan simpul yang sudah dikunjungi agar program tidak terjebak *infinite loop* saat menemui siklus (*cycle*).

```java
import java.util.*;

void dfs(Map<String, List<String>> graph, String start, String target) {
    Stack<String> stack = new Stack<>();
    Set<String> visited = new HashSet<>();
    stack.push(start);

    while (!stack.isEmpty()) {
        String current = stack.pop();
        if (visited.contains(current)) continue;

        visited.add(current);
        System.out.print(current + " ");
        if (current.equals(target)) return; // Target ditemukan

        // Masukkan tetangga ke stack
        for (String neighbor : graph.get(current)) {
            if (!visited.contains(neighbor)) {
                stack.push(neighbor);
            }
        }
    }
}
```

### 2. Breadth-First Search (BFS)
BFS menelusuri graf secara melebar **per level/lapisan**—mengunjungi semua tetangga langsung dari simpul awal terlebih dahulu sebelum melangkah ke tetangga berikutnya.
* **Struktur Data:** **Queue** (FIFO — *First-In, First-Out*).

```java
import java.util.*;

void bfs(Map<String, List<String>> graph, String start, String target) {
    Queue<String> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    queue.add(start);
    visited.add(start);

    while (!queue.isEmpty()) {
        String current = queue.poll();
        System.out.print(current + " ");
        if (current.equals(target)) return; // Target ditemukan

        for (String neighbor : graph.get(current)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
}
```

### 3. Simulasi Tracing Soal Ujian (Graf 8 Node)
Misalkan diketahui graf berarah berikut (urutan tetangga dibaca dari kiri ke kanan) dan kita mencari simpul **`a8`** mulai dari **`a1`**:
* `a1` terhubung ke: `a2`, `a3`
* `a2` terhubung ke: `a4`, `a5`
* `a3` terhubung ke: `a6`, `a7`
* `a5` terhubung ke: `a8`

#### Alur Pencarian DFS (Menyelam ke dalam terlebih dahulu)
1. Mulai dari `a1` $\rightarrow$ masuk ke cabang pertama `a2` $\rightarrow$ masuk ke cabang pertama `a4` (mentok, *backtrack* ke `a2`).
2. Dari `a2` lanjut ke cabang berikutnya `a5` $\rightarrow$ turun ke `a8` (**Ditemukan**).
* **Urutan kunjungan DFS:** `a1` $\rightarrow$ `a2` $\rightarrow$ `a4` $\rightarrow$ `a5` $\rightarrow$ `a8` (cabang `a3` belum sempat disentuh).

#### Alur Pencarian BFS (Menyapu per level dari atas ke bawah)
1. **Level 0:** Kunjungi `a1`.
2. **Level 1:** Kunjungi semua tetangga `a1`, yaitu `a2` lalu `a3`.
3. **Level 2:** Kunjungi semua tetangga `a2` (`a4`, `a5`), lalu semua tetangga `a3` (`a6`, `a7`).
4. **Level 3:** Kunjungi tetangga `a5`, yaitu `a8` (**Ditemukan**).
* **Urutan kunjungan BFS:** `a1` $\rightarrow$ `a2` $\rightarrow$ `a3` $\rightarrow$ `a4` $\rightarrow$ `a5` $\rightarrow$ `a6` $\rightarrow$ `a7` $\rightarrow$ `a8`.

### 4. Perbandingan DFS vs BFS

| Aspek | Depth-First Search (DFS) | Breadth-First Search (BFS) |
| :--- | :--- | :--- |
| **Struktur Data** | Stack (LIFO) / Rekursi | Queue (FIFO) |
| **Pola Penelusuran** | Vertikal (sedalam mungkin per cabang) | Horizontal (melebar per level kedalaman) |
| **Kompleksitas Waktu** | $O(V + E)$ | $O(V + E)$ |
| **Kompleksitas Ruang** | $O(V)$ (sebanding tinggi/kedalaman graf) | $O(V)$ (sebanding lebar maksimal level graf) |
| **Kegunaan Utama** | Deteksi siklus, *topological sort*, *maze solving* | Mencari jalur terpendek (*shortest path*) pada graf tanpa bobot |
