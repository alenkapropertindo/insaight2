import { BenefitItem, FeatureItem, PromptItem, TestimonialItem, FaqItem } from "./types";

export interface UseCaseItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface AudienceItem {
  id: string;
  emoji: string;
  label: string;
}

export const featuresData: FeatureItem[] = [
  {
    id: "feat-1",
    icon: "GraduationCap",
    prefix: "🎓",
    title: "Belajar AI dari Dasar Hingga Mahir",
    description: "Pelajari penggunaan AI secara praktis untuk kehidupan sehari-hari, pekerjaan, bisnis, dan proyek pribadi. Belajar tanpa istilah teknis yang membingungkan."
  },
  {
    id: "feat-2",
    icon: "TrendingUp",
    prefix: "🚀",
    title: "Bimbingan dari Ide Sampai Eksekusi",
    description: "Bukan hanya teori. Kami membantu anggota mengubah ide menjadi proyek nyata. Mulai dari: Menemukan ide, Validasi, Perencanaan, Pembuatan, hingga Launching."
  },
  {
    id: "feat-3",
    icon: "Users2",
    prefix: "🤝",
    title: "Komunitas yang Aktif & Supportif",
    description: "Belajar akan jauh lebih cepat ketika dilakukan bersama. Di komunitas kamu bisa: Bertanya kapan saja, Diskusi bersama, Sharing pengalaman, Minta feedback, Kolaborasi proyek, dan Networking."
  },
  {
    id: "feat-4",
    icon: "CheckSquare",
    prefix: "🎯",
    title: "Challenge & Project Bersama",
    description: "Belajar lewat praktik langsung. Setiap anggota dapat mengikuti berbagai program challenge seru untuk membangun Portofolio, Skill, Pengalaman, dan Relasi."
  },
  {
    id: "feat-5",
    icon: "Lightbulb",
    prefix: "💡",
    title: "Update AI Terbaru",
    description: "Tidak perlu bingung mengikuti perkembangan AI yang sangat cepat. Kami akan membagikan AI Tools Baru, Prompt Baru, Workflow Baru, Update Fitur, dan Peluang Baru."
  }
];

export const useCasesData: UseCaseItem[] = [
  {
    id: "uc-1",
    icon: "Briefcase",
    title: "Freelance",
    description: "Kerjakan proyek lebih cepat, layani lebih banyak klien, dan tingkatkan penghasilan dengan bantuan AI."
  },
  {
    id: "uc-2",
    icon: "Video",
    title: "Content Creator",
    description: "Produksi konten berkualitas setiap hari tanpa kehabisan ide."
  },
  {
    id: "uc-3",
    icon: "TrendingUp",
    title: "Bisnis",
    description: "Pantau kesehatan bisnis dalam satu dashboard dan biarkan AI mendeteksi potensi penyimpangan sebelum menjadi kerugian."
  },
  {
    id: "uc-4",
    icon: "Sparkles",
    title: "Jasa AI",
    description: "Bangun bisnis jasa berbasis AI meski belum bisa coding."
  },
  {
    id: "uc-5",
    icon: "Zap",
    title: "Affiliate",
    description: "Biarkan AI membantu mencari ide konten, membuat copywriting, dan meningkatkan konversi penjualan."
  },
  {
    id: "uc-6",
    icon: "ShoppingBag",
    title: "Digital Product",
    description: "Ubah pengetahuan menjadi produk digital yang bisa dijual berulang kali."
  },
  {
    id: "uc-7",
    icon: "Users",
    title: "Personal Branding",
    description: "Bangun citra profesional secara konsisten tanpa harus membuat semua konten sendiri."
  },
  {
    id: "uc-8",
    icon: "Cpu",
    title: "Automasi Pekerjaan",
    description: "Kurangi pekerjaan berulang dan fokus pada hal yang benar-benar penting."
  }
];

export const targetAudienceData: AudienceItem[] = [
  { id: "ta-1", emoji: "🎓", label: "Pelajar" },
  { id: "ta-2", emoji: "👨‍🎓", label: "Mahasiswa" },
  { id: "ta-3", emoji: "👨‍💼", label: "Karyawan" },
  { id: "ta-4", emoji: "💼", label: "Freelancer" },
  { id: "ta-5", emoji: "🏪", label: "UMKM" },
  { id: "ta-6", emoji: "📈", label: "Pebisnis" },
  { id: "ta-7", emoji: "🏠", label: "Agen Properti" },
  { id: "ta-8", emoji: "🎨", label: "Desainer" },
  { id: "ta-9", emoji: "📱", label: "Content Creator" },
  { id: "ta-10", emoji: "💻", label: "Programmer" },
  { id: "ta-11", emoji: "📊", label: "Digital Marketing" },
  { id: "ta-12", emoji: "🙋", label: "Pemula yang ingin belajar AI" }
];

export const benefitsData: BenefitItem[] = [
  {
    id: "ben-1",
    icon: "TrendingUp",
    title: "🚀 Skill Masa Depan",
    description: "Mulai memahami dasar-dasar AI hingga penerapan praktis yang divalidasi oleh industri kreatif dan operasional modern."
  },
  {
    id: "ben-2",
    icon: "Users2",
    title: "🤝 Networking Lokal",
    description: "Terhubung dengan sesama kreator digital, freelancer, pemilik bisnis, dan mahasiswa di Kendari untuk kolaborasi nyata."
  },
  {
    id: "ben-3",
    icon: "CheckSquare",
    title: "🎯 Belajar Praktik Langsung",
    description: "Tidak hanya materi teori abstrak, kelas dipandu dengan instruksi langsung di mana Anda langsung mempraktikkan tools AI."
  },
  {
    id: "ben-4",
    icon: "Flame",
    title: "📈 Update Tools Tercepat",
    description: "Tetap update dengan perkembangan teknologi AI terbaru sebelum ramai digunakan, merebut momentum kompetitif di pasar."
  },
  {
    id: "ben-5",
    icon: "Lightbulb",
    title: "💡 Ide Konten Tanpa Batas",
    description: "Keluar dari writers block dengan bantuan workflow AI untuk memproduksi puluhan ide konten dalam hitungan menit."
  },
  {
    id: "ben-6",
    icon: "Briefcase",
    title: "💼 Peluang Pendapatan Baru",
    description: "Buka pintu karir sampingan (side hustle) dengan menawarkan layanan visual, penulisan konten, atau analisis berbasis AI."
  }
];

export const promptsData: PromptItem[] = [
  {
    id: "prompt-1",
    category: "Content Creator",
    title: "Pembuat Hook Instagram Reels / TikTok",
    description: "Gunakan prompt ini untuk membuat 5 opsi hook video yang click-worthy dan menahan audiens agar menonton video Anda lebih lama.",
    template: "Saya ingin membuat video pendek di [Platform] tentang [Topik]. Target audiens saya adalah [Target Audiens]. Berikan saya 5 pilihan kalimat Hook pembuka yang sangat memicu rasa ingin tahu (curiosity gap) dalam format interaksi langsung atau pertanyaan mengejutkan. Sebutkan juga alasan psikologis di balik setiap Hook tersebut.",
    variables: {
      "Platform": "TikTok",
      "Topik": "tips produktivitas belajar mahasiswa teknik",
      "Target Audiens": "mahasiswa aktif di Sulawesi Tenggara"
    }
  },
  {
    id: "prompt-2",
    category: "Business",
    title: "Kerangka Promo Jasa Lokal (AIDA)",
    description: "Rancang strategi penulisan iklan menggunakan kerangka klasik AIDA (Attention, Interest, Desire, Action) yang disesuaikan khusus bisnis jasa.",
    template: "Tulis copywriting promosi menarik menggunakan struktur AIDA untuk layanan jasa [Nama Jasa] yang berlokasi di [Kota]. Fokuskan pada memecahkan masalah [Masalah Utama Pelanggan] dan tawarkan keunggulan utama yaitu [Keunggulan]. Tambahkan Call to Action yang mendesak namun ramah untuk menghubungi WhatsApp.",
    variables: {
      "Nama Jasa": "Jasa Pembersih AC BersihVibe",
      "Kota": "Kendari",
      "Masalah Utama Pelanggan": "AC mati mendadak dan gerah saat kerja remote",
      "Keunggulan": "garansi dingin dalam 1 jam atau gratis biaya servis"
    }
  },
  {
    id: "prompt-3",
    category: "Design",
    title: "Prompt Midjourney Foto Produk Estetik",
    description: "Template pembuatan perintah pembuatan aset visual produk profesional yang tampak mewah dan natural di Midjourney atau Leonardo AI.",
    template: "Studio lighting photography of [Nama Produk] placed on a smooth [Bahan Alas] with minor ingredients of [Bahan Tambahan] scattered around, soft glowing twilight lighting, cinematic atmosphere, 8k resolution, ultra-detailed textures, photorealistic --ar 16:9 --v 6.0",
    variables: {
      "Nama Produk": "a minimalistic skin care glass bottle",
      "Bahan Alas": "white marble slab",
      "Bahan Tambahan": "fresh white jasmine flowers and clear water droplets"
    }
  },
  {
    id: "prompt-4",
    category: "Productivity",
    title: "Asisten Ringkasan Transkrip Rapat / Kelas",
    description: "Rangkum poin-poin panjang dari rekaman suara atau naskah kuliah panjang menjadi bullet points aksi praktis.",
    template: "Analisis teks transkrip berikut dan buatkan ringkasan eksekutif yang memuat: 1) Ide pokok utama rapat, 2) Daftar keputusan penting yang telah dicantumkan, dan 3) Lembar Action Items (siapa melakukan apa) dalam bentuk tabel terstruktur. Ini teks transkripnya: [Teks Transkrip]",
    variables: {
      "Teks Transkrip": "Rapat insAIght membahas rencana kolaborasi seminar bersama UKM Universitas Halu Oleo Kendari pada bulan Juni. Kita setuju tiket masuk Rp15.000 untuk umum. Budi bertanggung jawab untuk menghubungi pihak kampus, sedangkan Sitti akan mendesain poster promosi selesai minggu ini."
    }
  }
];

export const testimonialsData: TestimonialItem[] = [
  {
    id: "test-1",
    name: "Rian Saputra",
    role: "Freelance Graphic Designer & AI Artist",
    text: "Bergabung dengan insAIght Kendari memberi saya perspektif baru. Sekarang saya bisa memangkas waktu pengerjaan aset desain maskot dari 3 hari menjadi cuma 2 jam pakai kombinasi Midjourney dan Photoshop AI!",
    rating: 5
  },
  {
    id: "test-2",
    name: "Andi Sitti Sarah",
    role: "UMKM Owner (Fashion & Kuliner)",
    text: "Dulu pusing mikir caption dan bikin materi promosi tiap hari. Lewat kelas mingguan insAIght, saya diajarin bikin 30 draf konten sekaligus pakai ChatGPT. Sangat terbantu buat pebisnis sibuk!",
    rating: 5
  },
  {
    id: "test-3",
    name: "Taufik Hidayat",
    role: "Mahasiswa Teknik Universitas Halu Oleo",
    text: "Banyak mahasiswa cuma tahu AI buat bikin tugas. Di sini saya diajari cari celah cuan sampingan, yaitu ngebangun video visual AI edukasi dan alhamdulillah bisa dapet cuan luar biasa dari konten affiliate!",
    rating: 5
  }
];

export const faqsData: FaqItem[] = [
  {
    id: "faq-1",
    question: "Apakah pemula yang belum pernah memakai AI sama sekali bisa bergabung?",
    answer: "Sangat bisa! Kurikulum di insAIght Kendari dirancang secara adaptif dari level 'Beginner' (pengenalan dasar, instalasi, prompt dasar) hingga level profesional yang berorientasi produktivitas dan bisnis."
  },
  {
    id: "faq-2",
    question: "Bagaimana sistem kelas mingguan dilaksanakan?",
    answer: "Kami mengadakan Live Class mingguan secara online via Zoom / Google Meet setiap akhir pekan agar fleksibel diikuti pekerja dan mahasiswa. Bagi yang berhalangan hadir, semua rekaman kelas tersimpan rapi di dashboard anggota."
  },
  {
    id: "faq-3",
    question: "Apakah akan ada pertemuan offline di Kendari?",
    answer: "Ya! Kami merencanakan sesi kopi darat (kopdar) bulanan, meetup komunitas kreatif Kendari, dan sesi workshop praktis bersama pembicara tamu secara offline bagi sesama anggota yang berada di kota Kendari."
  },
  {
    id: "faq-4",
    question: "Bagaimana cara melakukan pembayaran dan verifikasi pendaftaran?",
    answer: "Anda cukup mengklik tombol daftar untuk mengisi formulir pendaftaran. Setelah mengisi data diri, sistem akan mengarahkan Anda langsung ke WhatsApp admin resmi kami untuk proses verifikasi pendaftaran."
  }
];
