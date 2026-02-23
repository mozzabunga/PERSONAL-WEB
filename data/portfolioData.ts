
import { PortfolioData } from '../types';

export const portfolioData: PortfolioData = {
  name: "Mozza Bunga Tarmuji",
  headline: "Office Management & AI Digital Marketing Specialist",
  summary: "Lulusan Manajemen Perkantoran dari SMK Negeri 3 Karawang dengan sertifikasi BNSP dan pengalaman administrasi mendalam di industri manufaktur (PT Astra Nippon Gasket). Memiliki keahlian khusus dalam Digital Marketing berbasis AI melalui program JIDA (Jabar Istimewa Digital Academy). Terampil dalam pengelolaan dokumen logistik, pengarsipan digital, dan korespondensi profesional dengan standar disiplin kerja Jepang (5S/Kaizen).",
  // Embedded the provided professional photo directly
  profileImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800", 
  contact: {
    email: "mozza.bunga.tarmuji.07@gmail.com",
    phone: "+62 857-7779-5713",
    linkedin: "linkedin.com/in/mozza-bunga-tarmuji-076016360",
    location: "Kec. Majalaya, Karawang, 41371"
  },
  education: [
    {
      institution: "SMK Negeri 3 Karawang",
      major: "Manajemen Perkantoran dan Layanan Bisnis",
      period: "2022 - 2025",
      details: [
        "Fokus pada administrasi perkantoran modern, manajemen kearsipan, dan korespondensi bisnis internasional.",
        "Menguasai paket Microsoft Office dan Google Workspace untuk efisiensi operasional.",
        "Sertifikasi Kompetensi Keahlian (UKK) dengan predikat kompeten dalam manajemen layanan bisnis."
      ]
    }
  ],
  experience: [
    {
      role: "Staff Gudang (Praktik Kerja Lapangan)",
      company: "PT Astra Nippon Gasket Indonesia",
      period: "Juli 2024 - September 2024",
      location: "Internship (Magang)",
      type: "Logistics Admin",
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=200",
      achievements: [
        "Memproses 50+ manifest logistik setiap bulan dengan akurasi 100% menggunakan sistem verifikasi checklist.",
        "Mengelola distribusi 30 dokumen operasional harian ke departemen Finance untuk kelancaran arus kas.",
        "Implementasi input data inventaris real-time untuk mendukung kontrol stok berbasis FIFO.",
        "Menangani 15+ koordinasi telepon harian antar departemen untuk sinkronisasi jadwal pengiriman.",
        "Menerapkan budaya kerja 5S dalam manajemen arsip fisik dan digital gudang."
      ]
    },
    {
      role: "Teller (Praktek Kerja Lapangan)",
      company: "Bank Netika",
      period: "Oktober 2023 - Desember 2023",
      location: "Internship (Magang)",
      type: "Finance",
      image: "https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&q=80&w=200",
      achievements: [
        "Melayani transaksi harian 50+ nasabah dengan standar pelayanan prima (Service Excellence).",
        "Bertanggung jawab atas rekonsiliasi kas harian untuk memastikan nol selisih pada laporan keuangan.",
        "Digitalisasi catatan transaksi menggunakan Excel untuk mempercepat proses audit internal.",
        "Membangun komunikasi persuasif dalam menjelaskan produk dan layanan perbankan kepada nasabah."
      ]
    }
  ],
  skills: [
    {
      category: "Administration & Tools",
      items: ["Microsoft Office Expert", "Google Workspace Guru", "Advanced Data Entry", "E-Filing Systems", "Inventory Management"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=400"
    },
    {
      category: "Digital Marketing & AI",
      items: ["AI-Powered Content Strategy", "Market Analysis with AI", "Prompt Engineering", "Copywriting", "Kaizen/5S Methodology"],
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=400"
    },
    {
      category: "Communication",
      items: ["Professional Correspondence", "Public Speaking", "Indonesian (Native)", "English (Business)", "Japanese (Basic)"],
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400"
    }
  ],
  certifications: [
    {
      title: "AI-Based Digital Marketing Specialist",
      issuer: "JIDA (Jabar Istimewa Digital Academy)",
      date: "Agustus 2025",
      details: "Sertifikasi prestisius dengan tingkat seleksi ketat, berfokus pada pemanfaatan AI untuk efisiensi bisnis digital."
    },
    {
      title: "Sertifikasi Kompetensi Manajemen Perkantoran",
      issuer: "BNSP (Badan Nasional Sertifikasi Profesi)",
      date: "Mei 2025",
      details: "Lisensi nasional yang membuktikan kompetensi dalam administrasi, komunikasi, dan manajemen arsip."
    }
  ],
  projects: [
    {
      title: "Modern Office Ecosystem Simulation",
      description: "Membangun sistem alur kerja kantor digital yang mengintegrasikan AI untuk otomatisasi jadwal dan manajemen dokumen.",
      year: "2024",
      stack: ["AI Tools", "Google Workspace", "Business Logic"],
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
      impact: "Meningkatkan kecepatan pemrosesan dokumen hingga 40% dalam pengujian simulasi."
    }
  ],
  papers: []
};
