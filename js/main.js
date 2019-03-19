/*
* IndexedDB
* */
createDatabase();
function createDatabase() {
    if (!('indexedDB' in window)){
        console.log('Web Browser tidak mendukung Indexed DB');
        return;
    }
    var request = window.indexedDB.open('latihan-idb', 1);
    request.onerror = handleError;
    request.onupgradeneeded = (e) => {
        var db = e.target.result;
        db.onerror = handleError;
        var objectStore = db.createObjectStore ('mahasiswa',{
            keyPath : 'nim'
        });
        console.log('Object store mahasiswa berhasil dibuat');
    }
    request.onsuccess = (e) => {
        db = e.target.result;
        db.error = handleError;
        console.log ('Berhasil melakukan koneksi ke db lokal');
    }
}

function handleError (e){
    console.log('Error DB : ' + e.target.errorCode);
}

var nim = document.getElementById('nim'),
    nama = document.getElementById('nama'),
    gender = document.getElementById('gender'),
    form = document.getElementById('form-tambah'),
    tabel = document.getElementById('tabel-mahasiswa');

//tambah data
form.addEventListener('submit', tambahBaris);

function tambahBaris (e) {
    //cek apakah nim sudah ada
    if (tabel.rows.namedItem(nim.value)){
        alert('Error : NIM sudah terdaftar');
        e.preventDefault();
        return;
    }

    //tambahkan ke database
    tambahKeDatabase({
        nim :nim.value,
        nama : nama.value,
        gender : gender.value
    });

    //nambah Baris
    var baris = tabel.insertRow();
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(nim.value));
    baris.insertCell().appendChild(document.createTextNode(gender.value));

    //tambahkan tombol hapus
    var tombolHapus = document.createElement('input');
    tombolHapus.type = 'button';
    tombolHapus.value = 'hapus';
    tombolHapus.id = nim.value;
    baris.insertCell().appendChild(tombolHapus);
    e.preventDefault();

}

function tambahKeDatabase (mahasiswa){
    var objectStore = buatTransaksi().objectStore('mahasiswa');
    var request = objectStore.add(mahasiswa);
    request.onerror = handleError;
    request.onsuccess = console.log('Mahasiswa [ ' + mahasiswa.nim+' ] ditambahkan');
}

function buatTransaksi (){
    var transaksi = db.transaksi(['mahasiswa'],'readwrite');
    transaksi.onerror = handleError;
    transaksi.oncomplete = console.log('transaksi baru berhasil');

    return transaksi;
}