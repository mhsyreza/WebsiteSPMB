import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export type Status = 'pending' | 'diterima' | 'ditolak';

export interface Pendaftaran {
  id: string;
  nomor_pendaftaran: string;
  nama_lengkap: string;
  nisn: string | null;
  nik: string | null;
  tempat_lahir: string | null;
  tanggal_lahir: string | null;
  jenis_kelamin: string | null;
  agama: string | null;
  alamat: string | null;
  nomor_hp: string | null;
  email: string | null;
  asal_sekolah: string | null;
  tahun_lulus: string | null;
  jurusan: string;
  nama_ayah: string | null;
  nama_ibu: string | null;
  pekerjaan_ayah: string | null;
  pekerjaan_ibu: string | null;
  nomor_hp_ortu: string | null;
  status: Status;
  catatan: string | null;
  created_at: string;
}

export interface Pengumuman {
  id: string;
  judul: string;
  isi: string;
  penting: boolean;
  created_at: string;
}

export interface PpdbSettings {
  id: string;
  tahun_ajaran: string;
  is_open: boolean;
  kuota_dkv: number;
  kuota_mplb: number;
  kuota_otomotif: number;
  tanggal_buka: string | null;
  tanggal_tutup: string | null;
  updated_at: string;
}
