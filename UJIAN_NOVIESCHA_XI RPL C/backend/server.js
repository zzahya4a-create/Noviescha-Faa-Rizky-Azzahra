const express = require('express');
const cors = require("cors")
const pool = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors())

// 1. GET ALL ALAT
app.get('/api/alat', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM alat
        `);

        res.status(200).json({
            message: 'Data alat berhasil diambil',
            data: result.rows
        });

    } catch (error) {
        console.error('Gagal mengambil seluruh alat:', error.message);

        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data alat'
        });
    }
});

// 2. GET ALAT BY ID
app.get('/api/alat/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID alat harus berupa bilangan bulat positif'
        });
    }

    try {
        const result = await pool.query(
            `SELECT * FROM alat WHERE id_alat = $1`,
            [id]
        );


        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'Alat tidak ditemukan'
            });
        }

        res.status(200).json({
            message: 'Alat berhasil ditemukan',
            data: result.rows[0]
        });

    } catch (error) {
        console.error('Gagal mengambil alat:', error.message);

        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data alat'
        });
    }
});
// 3. DELETE ALAT
app.delete('/api/alat/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('ID alat tidak valid');
    }

    try {
        // Gunakan async/await dan parameter $1
        const result = await pool.query('DELETE FROM alat WHERE id_alat = $1 RETURNING *', [id]);
        
        // Cek apakah data benar-benar ada dan terhapus
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Alat tidak ditemukan' });
        }

        res.status(200).json({
            message: 'Alat berhasil dihapus'
        });

    } catch (error) {
        console.error('Error saat hapus alat:', error.message);
        res.status(500).json({ 
            message: 'Gagal menghapus alat. Pastikan alat tidak sedang dipinjam.' 
        });
    }
});

// CREATE ALAT
app.post('/api/alat', async (req, res) => {
    const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;
    if (!nama_alat || !kondisi || !stok || !lokasi ) {
        return res.status(400).json({
            message: 'Data alat tidak valid'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO alat
(id_kategori, nama_alat, kondisi, stok, lokasi)
VALUES ($1, $2, $3, $4::integer, $5 )
RETURNING *`,
            [
                id_kategori,
                nama_alat.trim(),
                kondisi.trim(),
                stok,
                lokasi.trim()
            ],
        );
        res.status(201).json({
            message: 'alat berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal menambahkan alat:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan alat'
        });
    }
});


// EDIT ALAT
app.put('/api/alat/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;
    if (!nama_alat || !kondisi || !stok || !lokasi ) {
        return res.status(400).json({
            message: 'Data alat tidak valid'
        });
    }

    try {
        const result = await pool.query(
            `UPDATE alat
        SET
        id_kategori = $1,
        nama_alat = $2,
        kondisi = $3,
        stok = $4,
        lokasi = $5
        WHERE id_alat = $6
RETURNING *`,
            [
                id_kategori,
                nama_alat.trim(),
                kondisi.trim(),
                stok,
                lokasi.trim(),
                id
            ],
        );
        res.status(201).json({
            message: 'alat berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal menambahkan alat:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan alat'
        });
    }
});


// GET ALL KATEGORI 
app.get('/api/kategori', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM kategori_alat'
        );


        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Gagal mengambil seluruh kategori:', error.message);

        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data kategori'
        });
    }
});

// GET BY ID KATEGORI
app.get('/api/kategori/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID kategori harus berupa bilangan bulat positif'
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM kategori_alat WHERE id_kategori = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'kategori tidak ditemukan'
            });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Gagal mengambil kategori:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data kategori'
        });
    }
});


// GET ALLPEMINJAMAN
app.get('/api/peminjaman', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM peminjaman'
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Gagal mengambil seluruh peminjaman:', error.message);

        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data peminjaman'
        });
    }
});

// GET BY ID PEMINJAMAN
app.get('/api/peminjaman/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({
            message: 'ID peminjaman harus berupa bilangan bulat positif'
        });
    }

    try {
        const result = await pool.query(
            'SELECT * FROM peminjaman WHERE id_peminjaman = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: 'peminjaman tidak ditemukan'
            });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Gagal mengambil peminjaman:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat mengambil data peminjaman'
        });
    }
});

// CREATE PEMINJAMAN
app.post('/api/peminjaman', async (req, res) => {
    const { id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali, jumlah, status } = req.body;
    
    if (!id_alat || !nama_peminjam || !kelas || !tanggal_pinjam || !jumlah || !status ) {
        return res.status(400).json({
            message: 'Data pinjaman tidak valid'
        });
    }

    try {
        const result = await pool.query(
            `INSERT INTO peminjaman
(id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali, jumlah, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *`,
            [
                id_alat,
                nama_peminjam,
                kelas,
                tanggal_pinjam,
                tanggal_kembali, // Boleh bernilai null
                jumlah,
                status
            ],
        );
        res.status(201).json({
            message: 'peminjaman berhasil ditambahkan',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal menambahkan peminjam:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat menambahkan peminjam'
        });
    }
});

// EDIT PEMINJAMAN
app.put('/api/peminjaman/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali, jumlah, status } = req.body;
    
    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID peminjaman tidak valid' });
    }

    try {
        const result = await pool.query(
            `UPDATE peminjaman
            SET
            id_alat = $1,
            nama_peminjam = $2,
            kelas = $3,
            tanggal_pinjam = $4,
            tanggal_kembali = $5,
            jumlah = $6,
            status = $7
            WHERE id_peminjaman = $8
            RETURNING *`,
            [
                id_alat,
                nama_peminjam,
                kelas,
                tanggal_pinjam,
                tanggal_kembali, 
                jumlah,
                status, // 🔑 HAPUS .trim() DARI SINI
                id
            ]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
        }
        res.status(200).json({
            message: 'Peminjaman berhasil diperbarui',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Gagal memperbarui peminjaman:', error.message);
        res.status(500).json({
            message: 'Terjadi kesalahan saat memperbarui peminjaman'
        });
    }
});

// HAPUS PEMINJAMAN
app.delete('/api/peminjaman/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ message: 'ID peminjaman tidak valid' });
    }

    try {
        const result = await pool.query(
            'DELETE FROM peminjaman WHERE id_peminjaman = $1 RETURNING *', 
            [id]
        );
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Peminjaman tidak ditemukan' });
        }
        
        res.status(200).json({ message: 'Peminjaman berhasil dihapus' });
        
    } catch (error) {
        console.error('Gagal hapus peminjaman:', error.message);
        res.status(500).json({ 
            message: 'Gagal menghapus peminjaman dari database' 
        });
    }
});

// MENJALANKAN SERVER
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});