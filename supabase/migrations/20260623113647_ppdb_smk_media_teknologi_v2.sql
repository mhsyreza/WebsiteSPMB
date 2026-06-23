/*
  # PPDB SMK Media Teknologi - Full Schema

  1. Tables: pendaftaran, pengumuman, ppdb_settings
  2. RLS enabled, public can read/insert, admin can update/delete
  3. Auto-generate nomor_pendaftaran trigger
*/

-- Pendaftaran table
CREATE TABLE IF NOT EXISTS pendaftaran (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nomor_pendaftaran text UNIQUE,
  nama_lengkap text NOT NULL,
  nisn text,
  nik text,
  tempat_lahir text,
  tanggal_lahir date,
  jenis_kelamin text,
  agama text,
  alamat text,
  nomor_hp text,
  email text,
  asal_sekolah text,
  tahun_lulus text,
  jurusan text NOT NULL,
  nama_ayah text,
  nama_ibu text,
  pekerjaan_ayah text,
  pekerjaan_ibu text,
  nomor_hp_ortu text,
  status text NOT NULL DEFAULT 'pending',
  catatan text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pendaftaran ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pendaftaran" ON pendaftaran;
CREATE POLICY "anon_select_pendaftaran" ON pendaftaran
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_pendaftaran" ON pendaftaran;
CREATE POLICY "anon_insert_pendaftaran" ON pendaftaran
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pendaftaran" ON pendaftaran;
CREATE POLICY "auth_update_pendaftaran" ON pendaftaran
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pendaftaran" ON pendaftaran;
CREATE POLICY "auth_delete_pendaftaran" ON pendaftaran
  FOR DELETE TO authenticated USING (true);

-- Auto-generate nomor pendaftaran
CREATE OR REPLACE FUNCTION generate_nomor_pendaftaran()
RETURNS TRIGGER AS $$
DECLARE
  seq_num int;
BEGIN
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(nomor_pendaftaran FROM 'PPDB-2025-(.*)') AS int)
  ), 0) + 1
  INTO seq_num
  FROM pendaftaran
  WHERE nomor_pendaftaran LIKE 'PPDB-2025-%';

  NEW.nomor_pendaftaran := 'PPDB-2025-' || LPAD(seq_num::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_nomor_pendaftaran ON pendaftaran;
CREATE TRIGGER trigger_nomor_pendaftaran
  BEFORE INSERT ON pendaftaran
  FOR EACH ROW
  WHEN (NEW.nomor_pendaftaran IS NULL)
  EXECUTE FUNCTION generate_nomor_pendaftaran();

-- Pengumuman table
CREATE TABLE IF NOT EXISTS pengumuman (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  judul text NOT NULL,
  isi text NOT NULL,
  penting boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pengumuman ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pengumuman" ON pengumuman;
CREATE POLICY "anon_select_pengumuman" ON pengumuman
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_pengumuman" ON pengumuman;
CREATE POLICY "auth_insert_pengumuman" ON pengumuman
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_pengumuman" ON pengumuman;
CREATE POLICY "auth_update_pengumuman" ON pengumuman
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_pengumuman" ON pengumuman;
CREATE POLICY "auth_delete_pengumuman" ON pengumuman
  FOR DELETE TO authenticated USING (true);

-- PPDB settings table
CREATE TABLE IF NOT EXISTS ppdb_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tahun_ajaran text NOT NULL DEFAULT '2025/2026',
  is_open boolean DEFAULT true,
  kuota_dkv int DEFAULT 36,
  kuota_mplb int DEFAULT 36,
  kuota_otomotif int DEFAULT 36,
  tanggal_buka date,
  tanggal_tutup date,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ppdb_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_settings" ON ppdb_settings;
CREATE POLICY "anon_select_settings" ON ppdb_settings
  FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_settings" ON ppdb_settings;
CREATE POLICY "auth_insert_settings" ON ppdb_settings
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_settings" ON ppdb_settings;
CREATE POLICY "auth_update_settings" ON ppdb_settings
  FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_settings" ON ppdb_settings;
CREATE POLICY "auth_delete_settings" ON ppdb_settings
  FOR DELETE TO authenticated USING (true);

-- Seed default settings
INSERT INTO ppdb_settings (tahun_ajaran, is_open, kuota_dkv, kuota_mplb, kuota_otomotif, tanggal_buka, tanggal_tutup)
VALUES ('2025/2026', true, 36, 36, 36, '2025-07-01', '2025-08-31');

-- Seed announcements
INSERT INTO pengumuman (judul, isi, penting) VALUES
  ('Pendaftaran PPDB 2025/2026 Resmi Dibuka!',
   'SMK Media Teknologi dengan bangga mengumumkan bahwa Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2025/2026 telah resmi dibuka. Daftarkan diri Anda sekarang dan jadilah bagian dari keluarga besar SMK Media Teknologi!',
   true),
  ('Persyaratan Dokumen Pendaftaran',
   'Calon peserta didik wajib menyiapkan: (1) Fotokopi Ijazah/STTB SMP/sederajat yang telah dilegalisir, (2) Fotokopi Rapor semester 1-5, (3) Pas foto 3x4 berlatar merah sebanyak 4 lembar, (4) Fotokopi Kartu Keluarga, (5) Fotokopi KTP Orang Tua/Wali, (6) Surat Keterangan Sehat dari dokter.',
   false),
  ('Jadwal Seleksi dan Pengumuman PPDB 2025/2026',
   'Pendaftaran Online: 1 Juli - 31 Agustus 2025 | Verifikasi Berkas: 1-10 September 2025 | Tes Seleksi: 15 September 2025 | Pengumuman Hasil: 20 September 2025 | Daftar Ulang: 21-30 September 2025.',
   false);
