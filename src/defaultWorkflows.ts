export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
}

export interface SubTask {
  id: string;
  text: string;
  isPrompt?: boolean;
  promptTitle?: string;
  promptDescription?: string;
  promptTemplate?: string;
  promptVariables?: PromptVariable[];
  link?: { text: string; url: string };
  subItems?: { id: string; text: string }[];
}

export interface RoadmapStep {
  id: number;
  title: string;
  watchUrl?: string;
  subTasks: SubTask[];
}

export interface WorkflowItem {
  id: string;
  category: string;
  isNew: boolean;
  isDraft?: boolean;
  isPublic?: boolean;
  title: string;
  description: string;
  promptTemplate: string;
  variables: { [key: string]: string };
  materiTutorial: {
    overview: string;
    steps: string[];
    tips: string[];
    recommendedTools: string[];
    is_draft?: boolean;
    is_public?: boolean;
  };
  duration: string;
  youtubeUrl?: string;
  geminiToolUrl?: string;
  roadmap?: RoadmapStep[];
}

export const defaultWorkflowsData: WorkflowItem[] = [
  {
    id: "wf-1",
    category: "AI Video",
    isNew: true,
    title: "FISHING SHORTS AI",
    description: "Framework prompt profesional untuk membuat konsep, skrip, dan visual video pendek (Shorts/Reels/TikTok) tentang memancing yang viral dan memikat penonton.",
    promptTemplate: "Saya ingin membuat naskah video pendek (Shorts/TikTok) tentang [Topik Memancing]. Target penonton saya adalah [Target Penonton]. Buat struktur naskah 60 detik yang memuat:\n1. Hook (detik 1-5): Kalimat pembuka yang mengejutkan atau visual menarik.\n2. Storytelling (detik 6-45): Narasi emosional atau teknik memancing khusus yang jarang diketahui.\n3. Climax/Resolution (detik 46-55): Hasil tangkapan atau kepuasan akhir.\n4. Call to Action (detik 56-60): Ajakan follow, like, atau cek link bio.\n\nTulis narasi dalam bahasa [Gaya Bahasa] yang santai namun bersemangat, lengkap dengan deskripsi visual adegan demi adegan (b-roll cue) untuk editor video.",
    variables: {
      "Topik Memancing": "Memancing ikan gabus raksasa di rawa terpencil",
      "Target Penonton": "Penggemar mancing mania dan anak muda",
      "Gaya Bahasa": "Bahasa gaul / santai tapi menegangkan"
    },
    materiTutorial: {
      overview: "Workflow memproduksi video memancing viral dalam 10 menit dengan memanfaatkan kecerdasan buatan dari ide sampai video jadi.",
      steps: [
        "Gunakan ChatGPT atau Gemini dengan Prompt 'FISHING SHORTS AI' di portal ini untuk menyusun naskah dan deskripsi adegan visual.",
        "Salin deskripsi b-roll visual hasil generate, lalu masukkan ke AI Video Generator seperti Luma Dream Machine atau Kling AI untuk merender klip video realistis.",
        "Gunakan ElevenLabs dengan suara maskulin yang dalam untuk merekam sulih suara naskah yang sudah dibuat.",
        "Satukan klip video dan suara ElevenLabs di CapCut, lalu tambahkan sound effect air mengalir, tarikan joran, dan musik menegangkan.",
        "Gunakan fitur 'Auto Captions' di CapCut untuk menambahkan teks dinamis bergaya Shorts masa kini."
      ],
      tips: [
        "Gunakan Hook visual yang memperlihatkan joran melengkung tajam di 3 detik pertama.",
        "Tambahkan kontras warna visual yang tinggi agar video tampak lebih segar di layar HP.",
        "Gunakan sound effect 'Whoosh' setiap kali pergantian adegan video."
      ],
      recommendedTools: [
        "ChatGPT / Claude (Naskah & Prompting)",
        "ElevenLabs (Voiceover AI premium)",
        "Kling AI / Runway Gen-3 (AI Video Generation)",
        "CapCut (Video Editing & Auto Captions)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/P72E81UatE8",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-2",
    category: "Edukasi & Edu",
    isNew: true,
    title: "PAPER CRAFT PROMPT-GEN",
    description: "Framework prompt profesional untuk merancang dan membuat pola kerajinan kertas (paper craft) kreatif bernilai edukasi tinggi untuk anak-anak.",
    promptTemplate: "Anda adalah desainer produk kreatif khusus mainan edukasi anak. Saya ingin merancang pola paper craft bertema [Tema Papercraft]. Target usia anak adalah [Target Usia]. Berikan panduan lengkap instruksi pembuatan:\n1. Konsep Desain: Tentukan karakter/objek utama dan elemen 3D yang akan dibentuk.\n2. Pola Potong & Lipat: Deskripsikan garis potong (solid line) dan garis lipat (dashed line) yang perlu digambar.\n3. Panduan Prompt Visual: Berikan prompt text-to-image (Midjourney/DALL-E) untuk men-generate pola tekstur datar yang bisa dicetak dan dilipat langsung oleh pengguna.\n4. Instruksi Langkah Perakitan: Tulis langkah-langkah merakitnya dengan bahasa yang sederhana dan ramah anak.",
    variables: {
      "Tema Papercraft": "Dinosaurus T-Rex Mini yang bisa digerakkan mulutnya",
      "Target Usia": "Anak-anak usia 6-10 tahun"
    },
    materiTutorial: {
      overview: "Strategi membangun produk digital edukatif berupa template Paper Craft siap cetak (printable) untuk dijual secara online atau digunakan di sekolah.",
      steps: [
        "Jalankan Prompt ini untuk merancang struktur bagian papercraft dan langkah instruksinya.",
        "Salin 'Prompt Visual' yang dihasilkan, lalu jalankan di Midjourney atau Leonardo.ai dengan aspek rasio 1:1 atau flat layout.",
        "Aset gambar hasil generate dibawa ke Canva untuk ditumpuk dengan garis bantu potong dan lipat menggunakan element garis putus-putus.",
        "Ekspor dokumen Canva Anda menjadi format PDF Print beresolusi tinggi.",
        "Kemas produk digital ini ke dalam Google Drive dan tawarkan sebagai produk edukasi gratis (lead magnet) atau berbayar di e-commerce."
      ],
      tips: [
        "Pastikan garis potong diberi warna merah atau hitam tebal agar tidak membingungkan anak-anak.",
        "Gunakan tema-tema populer yang sedang disukai anak-anak saat ini seperti luar angkasa atau hewan purba.",
        "Buat video tutorial singkat 15 detik yang memperlihatkan hasil akhir paper craft yang sudah jadi untuk meningkatkan daya tarik promosi."
      ],
      recommendedTools: [
        "Leonardo.ai / Midjourney (Pola Visual Datar)",
        "Canva (Layouting & Menambahkan Garis Bantu Lipat)",
        "ChatGPT (Instruksi Langkah Perakitan)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/6_6O0t2lZ18",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-3",
    category: "Edukasi & Edu",
    isNew: true,
    title: "VIDEO SCRIPT KONTEN PENDEK",
    description: "Framework prompt profesional untuk merancang naskah video pendek, penceritaan (storytelling) drama/cerita edukatif yang memicu retensi maksimal.",
    promptTemplate: "Tulis skrip video vertikal berdurasi [Durasi] detik dengan kerangka penceritaan dramatis tentang [Subjek/Topik]. Struktur skrip wajib mengikuti kaidah retensi tinggi:\n- Detik 0-3 (The Grabber): Berikan pertanyaan kontradiktif atau fakta mengejutkan.\n- Detik 4-15 (The Tension): Perkenalkan konflik atau masalah utama yang dihadapi audiens.\n- Detik 16-45 (The Resolution): Jabarkan 3 poin solusi konkret atau pelajaran moral yang dipetik.\n- Detik 46-60 (The Loop Hook): Kalimat penutup yang menyambung kembali ke kalimat awal jika video diulang.\n\nGaya penyampaian: [Gaya Bahasa] dengan nada suara yang berwibawa namun hangat.",
    variables: {
      "Durasi": "60",
      "Subjek/Topik": "Bagaimana seorang pemuda Kendari membangun agensi AI beromset puluhan juta dalam sebulan",
      "Gaya Bahasa": "Inspiratif, naratif, penuh emosi positif"
    },
    materiTutorial: {
      overview: "Panduan menulis skrip video edukasi atau soft-selling di TikTok/Reels yang memprioritaskan metrik retensi dan 'watch time' algoritma.",
      steps: [
        "Tentukan topik hangat yang relevan dengan target audiens lokal Anda.",
        "Sesuaikan variabel prompt di atas untuk menyusun skrip video lengkap dengan instruksi efek suara (SFX) dan visual adegan.",
        "Latih intonasi suara Anda agar dinamis (tidak monoton) saat membaca skrip hasil generate.",
        "Rekam video Anda dengan pencahayaan yang cukup di wajah, atau gunakan video stok berkualitas tinggi.",
        "Tambahkan subtitle per kata yang berganti cepat (word-by-word captions) untuk mempertahankan perhatian mata penonton."
      ],
      tips: [
        "Gunakan trik 'The Loop Hook' di mana kalimat akhir video dipotong menggantung dan tersambung sempurna dengan kata pertama kalimat pembuka video.",
        "Ganti angle atau visual b-roll setiap 2-3 detik sekali agar penonton tidak bosan."
      ],
      recommendedTools: [
        "ChatGPT / Claude (Perancang Skrip Retensi)",
        "CapCut / Premiere Pro (Video Editing)",
        "Pexels / Pixabay (Koleksi Video B-Roll Gratis)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/b0uKjK8bJpU",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-4",
    category: "Edukasi & Edu",
    isNew: true,
    title: "DOCUMENTARY STORY LONG",
    description: "Framework prompt profesional untuk merancang dan memproduksi video dokumenter narasi panjang bertema sejarah, sains, atau investigasi mendalam.",
    promptTemplate: "Saya ingin membuat garis besar (outline) dan naskah narasi lengkap untuk video dokumenter YouTube berdurasi 10-15 menit tentang [Topik Dokumenter]. Buat naskah yang terbagi menjadi 5 Babak terstruktur:\nBabak I: Prolog (Misteri atau Kejadian Luar Biasa)\nBabak II: Asal-Usul & Latar Belakang Masalah\nBabak III: Titik Balik (Konflik / Penemuan Utama)\nBabak IV: Analisis Mendalam & Sudut Pandang Berbeda\nBabak V: Epilog (Pesan Moral & Kesimpulan Filosofis)\n\nTulis narasi formal bergaya pembawa acara dokumenter [Gaya Dokumenter] dengan intonasi lambat, penuh penekanan kata, serta berikan rekomendasi musik latar (ambient soundscape cue) yang sesuai di setiap babak.",
    variables: {
      "Topik Dokumenter": "Sejarah tenggelamnya kapal megah di perairan Nusantara yang terlupakan",
      "Gaya Dokumenter": "National Geographic / BBC Earth"
    },
    materiTutorial: {
      overview: "Workflow merakit video dokumenter bergaya esai visual berdurasi panjang untuk membangun channel YouTube otomatis (faceless channel) berpenghasilan AdSense.",
      steps: [
        "Gunakan prompt 'DOCUMENTARY STORY LONG' untuk menghasilkan naskah narasi babak demi babak.",
        "Masukkan teks narasi hasil generate ke ElevenLabs, gunakan voice model bernada berat seperti 'Marcus' atau 'Adam'.",
        "Kumpulkan rekaman stok video sejarah dari situs arsip publik atau generate visual realistis bertema lampau menggunakan Midjourney.",
        "Susun lini masa di software editor video Anda, tempatkan voiceover sebagai fondasi utama lalu lapisi dengan video stok.",
        "Tambahkan musik latar sinematik bergenre ambient orchestra dengan volume sekitar -18dB agar suara narator tetap terdengar jelas."
      ],
      tips: [
        "Gunakan keheningan (silence) selama 1-2 detik setelah kalimat yang sangat dramatis untuk memberikan efek dramatis mendalam.",
        "Pastikan transisi antar adegan menggunakan efek cross-dissolve yang lembut."
      ],
      recommendedTools: [
        "ElevenLabs (Narator AI suara berat)",
        "Midjourney v6 (Aset Visual Sejarah / Sains)",
        "Epidemic Sound (Koleksi Musik Latar Premium)",
        "DaVinci Resolve / CapCut Desktop (Editing Video)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-5",
    category: "AI Video",
    isNew: true,
    title: "STORYBOARD.AI",
    description: "Framework prompt profesional untuk merancang storyboard visual yang detail, mengarahkan sudut kamera, pencahayaan, dan instruksi prompt video generator.",
    promptTemplate: "Saya memiliki konsep ide video: [Konsep Ide]. Bantu saya membuat naskah storyboard visual sebanyak [Jumlah Panel] adegan berurutan. Format output wajib disajikan dalam bentuk tabel markdown dengan kolom:\n1. Adegan Ke (Scene #)\n2. Deskripsi Visual (Apa yang terjadi di layar)\n3. Kamera Angle & Gerakan (e.g. Extreme Close Up, Panning Right, Slow Zoom)\n4. Teks / Suara (Narasi atau dialog adegan)\n5. Prompt Video AI: Prompt teks siap salin untuk dimasukkan ke video generator (Luma, Runway, Kling) demi menghasilkan visual yang persis digambarkan.",
    variables: {
      "Konsep Ide": "Iklan mobil sport listrik melintasi jalanan Kendari pesisir pantai di waktu malam hari dengan cahaya neon futuristik",
      "Jumlah Panel": "6"
    },
    materiTutorial: {
      overview: "Langkah terstruktur merancang papan cerita (storyboard) profesional untuk meminimalisir trial-error saat memproduksi aset visual menggunakan AI video generator.",
      steps: [
        "Jalankan Prompt Storyboard di atas dengan memasukkan konsep kasar ide video iklan atau film pendek Anda.",
        "Perhatikan kolom 'Prompt Video AI' yang tersusun secara presisi dengan instruksi kamera.",
        "Buka platform generator video (Kling AI, Runway, atau Luma), salin prompt per adegan tersebut dan render satu demi satu.",
        "Unduh hasil render video terbaik, lalu susun secara berurutan sesuai tabel storyboard yang telah kita rancang.",
        "Tambahkan musik dan efek suara agar tempo gerakan visual menyatu dengan ketukan audio."
      ],
      tips: [
        "Gunakan penambahan kata kunci seperti 'cinematic, masterpiece, 8k, photorealistic' di ujung prompt visual untuk meningkatkan kedalaman grafis.",
        "Pertahankan konsistensi objek utama dengan mendeskripsikan ciri fisik khas yang sama di setiap panel prompt."
      ],
      recommendedTools: [
        "ChatGPT / Claude (Perancang Storyboard)",
        "Runway Gen-3 / Kling AI / Luma Dream Machine (Video Generator)",
        "Grid / Notion (Menyimpan Tabel Storyboard)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-6",
    category: "AI Video",
    isNew: true,
    title: "STOP MOTION MINIATUR PRO",
    description: "Framework prompt profesional untuk memproduksi video stop motion dengan detail visual tanah liat (claymation) atau mainan miniatur estetik.",
    promptTemplate: "Rancang prompt gambar Midjourney dan petunjuk animasi untuk membuat adegan video stop-motion bergaya claymation tentang [Aktivitas Karakter]. Karakter utama adalah [Deskripsi Karakter].\n\nBerikan 3 variasi prompt Midjourney dengan format: 'Stop-motion claymation, detailed miniature clay character of [Karakter] doing [Aktivitas], macro shot, overhead warm studio lighting, handcrafted clay textures, playful atmosphere, whimsical aesthetic --ar 16:9 --v 6.0'\n\nSerta berikan panduan pengaturan motion (gerakan) di AI Video generator agar menghasilkan efek patah-patah khas animasi stop-motion tradisional.",
    variables: {
      "Aktivitas Karakter": "Memasak mie instan tradisional di dapur kecil kayu",
      "Deskripsi Karakter": "Kucing oranye lucu memakai celemek masak mini"
    },
    materiTutorial: {
      overview: "Seni memproduksi video animasi stop motion berkarakter tanah liat (claymation) yang menggemaskan menggunakan kombinasi image generator dan video generator modern.",
      steps: [
        "Gunakan prompt 'STOP MOTION MINIATUR PRO' untuk mendapatkan 3 versi prompt visual.",
        "Generate gambar utama di Midjourney atau Leonardo AI dengan menyalin prompt tersebut.",
        "Unggah gambar terpilih (misal kucing oren memasak) ke Runway Gen-3 atau Luma Dream Machine di menu 'Image-to-Video'.",
        "Atur parameter kecepatan gerakan ('motion strength') ke angka rendah (skala 2 atau 3) agar gerakan lambat dan patah-patah layaknya mainan fisik.",
        "Edit di CapCut, turunkan framerate video hasil render ke 12fps atau 15fps untuk memperkuat sensasi retro stop-motion."
      ],
      tips: [
        "Sertakan tekstur sidik jari halus pada model karakter tanah liat di prompt Anda untuk memberikan kesan buatan tangan (handcrafted) yang super otentik.",
        "Gunakan efek suara kayu berderit, ketukan piring, atau suara koki komikal kecil di latar suara."
      ],
      recommendedTools: [
        "Midjourney (Pembangkit Gambar Claymation)",
        "Luma Dream Machine (Image-to-Video dengan kontrol gerakan)",
        "CapCut (Framerate Adjuster & SFX)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-7",
    category: "AI Video",
    isNew: true,
    title: "CINEMATIC MOTIVATION PRO",
    description: "Framework prompt profesional untuk merancang video motivasi bergaya sinematik dengan visual dramatis, kontras tinggi, dan audio vokal yang menggetarkan jiwa.",
    promptTemplate: "Saya ingin membuat video motivasi berdurasi 30-45 detik tentang tema [Tema Motivasi]. Berikan saya:\n1. Naskah Monolog: Tulis kata-kata motivasi puitis yang mendalam, terbagi dalam 3 fase emosional (Lembah Keputusasaan, Perjuangan Sunyi, Kebangkitan Jiwa).\n2. Cue Visual Sinematik: Deskripsikan adegan visual b-roll beraura gelap, kontras tinggi, kabut tipis, atau pencahayaan dramatis di setiap kalimat.\n3. Desain Audio & Sound Effect: Detail kapan suara ambient pads naik, ketukan bass berat (sub-bass drop) berbunyi, dan musik orkestra klimaks masuk.",
    variables: {
      "Tema Motivasi": "Konsistensi bekerja keras dalam keheningan saat semua orang meremehkan impianmu",
      "Warna Visual": "Dark moody, smoky, amber warm rim light"
    },
    materiTutorial: {
      overview: "Alur kerja membuat konten motivasi bergaya sinematik gelap yang sangat disukai audiens media sosial untuk membangun personal brand atau channel motivasi.",
      steps: [
        "Jalankan prompt cinematic motivation dengan topik spesifik Anda di asisten AI.",
        "Masukkan teks monolog ke ElevenLabs, pilih klip suara narator legendaris berwibawa.",
        "Cari video stok bertema olahraga, pria berjalan di tengah kabut, atau suasana kota sunyi di malam hari.",
        "Gunakan filter warna 'Moody Dark' atau 'Cyberpunk' saat proses color grading di software editor video Anda.",
        "Selaraskan ketukan pergantian visual (video cut) tepat pada ketukan dentuman bass (beat drop) musik latar Anda."
      ],
      tips: [
        "Pastikan suara voiceover memiliki efek gema (reverb) yang halus agar terasa megah layaknya di dalam bioskop.",
        "Gunakan teks besar dengan jenis font sans-serif tebal (seperti Montserrat atau Impact) di tengah layar dengan animasi fade-in lembut."
      ],
      recommendedTools: [
        "ElevenLabs (Voiceover berwibawa)",
        "CapCut Desktop / Premiere Pro (Color Grading & Reverb Audio)",
        "Artlist / YouTube Audio Library (Musik Latar Sinematik)"
      ]
    },
    duration: "Estimasi: 10 menit",
    youtubeUrl: "https://www.youtube.com/embed/P72E81UatE8",
    geminiToolUrl: "https://gemini.google.com"
  },
  {
    id: "wf-8",
    category: "Edukasi & Edu",
    isNew: true,
    title: "WILDLIFE LONGFORM FRAMEWORK",
    description: "Framework prompt profesional untuk memproduksi video dokumenter alam liar (wildlife) berdurasi panjang dengan penceritaan dramatis hewan bertahan hidup.",
    promptTemplate: "Tulis naskah narasi dokumenter alam liar bergaya David Attenborough berdurasi 5 menit mengenai perjuangan hidup [Spesies Hewan] di habitat [Nama Habitat].\n\nNaskah harus menggambarkan perjuangan dramatis hewan tersebut saat [Krisis Tantangan] secara mendetail. Gunakan pilihan diksi yang puitis, deskriptif, dan penuh rasa hormat terhadap keajaiban alam. Sertakan panduan cue audio efek suara alam (misal: gemerisik daun, raungan angin, lolongan predator) di sela-sela narasi.",
    variables: {
      "Spesies Hewan": "Keluarga Macan Tutul Salju yang mengajari anaknya berburu pertama kali",
      "Nama Habitat": "Puncak tebing es terjal pegunungan Himalaya yang membeku",
      "Krisis Tantangan": "Badai es ekstrem tiba-grained di tengah menipisnya populasi mangsa"
    },
    materiTutorial: {
      overview: "Teknik memproduksi klip dokumenter alam liar yang dramatis dan sinematik dengan memanfaatkan model suara legendaris dan visual fotorealistik tinggi.",
      steps: [
        "Gunakan prompt wildlife di atas untuk menyusun teks narasi puitis.",
        "Gunakan ElevenLabs dengan model suara meniru narator legendaris (David Attenborough) untuk membacakan narasi.",
        "Buat prompt gambar di Midjourney: 'Photorealistic wildlife photography, [Spesies Hewan] in [Nama Habitat] battling [Krisis Tantangan], close-up details, 80mm lens, national geographic style --ar 16:9 --v 6.0'.",
        "Convert hasil gambar Midjourney terbaik menjadi klip video gerak lambat yang halus menggunakan Runway Gen-3.",
        "Rakit di editor video, lapis dengan efek suara alam (foley) seperti derit salju, embusan angin kencang, dan suara napas berat hewan."
      ],
      tips: [
        "Pilihlah stok audio foley alam yang berkualitas tinggi untuk menghidupkan suasana dingin atau terik di video Anda.",
        "Gunakan transisi gerak lambat (slow motion) pada adegan hewan melompat atau menatap tajam ke kamera untuk memperkuat efek dramatis."
      ],
      recommendedTools: [
        "Midjourney (Foto Fotorealistik Hewan)",
        "Runway Gen-3 (Pembangkit Gerakan Hewan Halus)",
        "ElevenLabs (AI Voice Cloning Narator Alam)",
        "Sonniss (Koleksi Efek Suara Alam Gratis)"
      ]
    },
    duration: "Estimasi: 100% praktis",
    youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    geminiToolUrl: "https://gemini.google.com"
  }
];
