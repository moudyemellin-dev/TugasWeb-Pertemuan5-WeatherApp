# Weather App - Tugas Rutin 5

Weather App merupakan tugas Pemrograman Web yang menggunakan OpenWeatherMap API untuk menampilkan informasi cuaca berdasarkan nama kota.

## Fitur

- Pencarian cuaca berdasarkan nama kota
- Menampilkan nama kota
- Menampilkan suhu
- Menampilkan deskripsi cuaca
- Menampilkan ikon cuaca
- Menampilkan kelembaban
- Loading state saat mengambil data
- Error handling kota tidak ditemukan (404)
- Error handling network
- Validasi input kosong
- Riwayat pencarian menggunakan LocalStorage
- Toggle suhu °C dan °F
- Responsive / mobile-friendly
- Prakiraan cuaca 5 hari
- Terasa seperti (Feels Like)
- Kecepatan angin
- Background berubah sesuai kondisi cuaca
- Hapus riwayat dengan konfirmasi

## Teknologi

- HTML5
- CSS3
- JavaScript ES6+
- Fetch API
- Async/Await
- OpenWeatherMap API
- LocalStorage

## Cara Menjalankan

1. Clone atau download repository.
2. Salin `config.example.js` menjadi `config.js`.
3. Masukkan API key OpenWeatherMap ke dalam `config.js`.
4. Jalankan `index.html` menggunakan Live Server.

Contoh:

```javascript
const CONFIG = {
    API_KEY: "YOUR_OPENWEATHER_API_KEY"
};

## Live Demo

[Buka Weather App](https://weather-app-moudy.netlify.app)
