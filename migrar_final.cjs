// migrar_final.cjs
const { createClient } = require('@supabase/supabase-js');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

// --- 1. TUS CLAVES DE SUPABASE ---
const SUPABASE_URL = 'https://lndakyqyeusnmmsfyhwg.supabase.co'; 
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZGFreXF5ZXVzbm1tc2Z5aHdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzOTYyMiwiZXhwIjoyMDgwMDE1NjIyfQ.0tf4VevRnzOJouU2ffQTLbAwgIha1X9kTquXxhey60s'; // Pega tu service_role key aquí

// --- 2. TUS CLAVES DE CLOUDFLARE R2 ---
const R2_ENDPOINT = 'https://61fae03541d8c2c76ecfa09d5b1f67c1.r2.cloudflarestorage.com';
const R2_ACCESS_KEY = '54a5b1af5cc7f4f5428ea0c98920bc2d';
const R2_SECRET_KEY = 'e6ef11b38ad514d0c17e0e151ff5fa9cd96134448782c9a18c421e93732c5a42';
const R2_BUCKET_DESTINO = 'media-mi-proyecto'; // <--- CONFIRMA QUE ESTE NOMBRE ES CORRECTO

// --- 3. LISTA DE BUCKETS QUE ENCONTRÓ EL DIAGNÓSTICO ---
const BUCKETS_ORIGEN = [
  'play-images',
  'actor-images',
  'gallery-images',
  'workshop-images',
  'blog-images'
];

// --- CLIENTES ---
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const r2 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY,
    secretAccessKey: R2_SECRET_KEY,
  },
});

async function migrar() {
  console.log("🚀 INICIANDO MIGRACIÓN DIRECTA...");
  console.log(`🎯 Destino R2 Bucket: ${R2_BUCKET_DESTINO}`);

  for (const bucketName of BUCKETS_ORIGEN) {
    console.log(`\n------------------------------------------------`);
    console.log(`📦 Procesando Bucket Supabase: [${bucketName}]`);

    // 1. Listar archivos en la raíz
    const { data: files, error } = await supabase.storage
      .from(bucketName)
      .list('', { limit: 100 });

    if (error) {
      console.error(`❌ Error listando ${bucketName}:`, error.message);
      continue;
    }

    if (files.length === 0) {
      console.log(`⚠️  Este bucket está vacío.`);
      continue;
    }

    console.log(`found ${files.length} archivos. Empezando subida...`);

    // 2. Recorrer y subir
    for (const file of files) {
      // Ignorar archivos de sistema
      if (file.name === '.emptyFolderPlaceholder') continue; 
      if (!file.id) continue; // Si no tiene ID, es una carpeta (aquí las saltamos)

      console.log(`   ➡️  Migrando: ${file.name}`);

      // A. Descargar (Bypass CDN lock)
      const { data: fileBlob, error: downError } = await supabase.storage
        .from(bucketName)
        .download(file.name);

      if (downError) {
        console.error(`      ❌ Error descargando: ${downError.message}`);
        continue;
      }

      // B. Convertir y preparar
      const buffer = Buffer.from(await fileBlob.arrayBuffer());
      const contentType = mime.lookup(file.name) || 'application/octet-stream';
      
      // C. Subir a R2
      // IMPORTANTE: Guardamos con el nombre del bucket como prefijo para no mezclar
      // Ejemplo en R2: "play-images/foto.png"
      const r2Key = `${bucketName}/${file.name}`; 

      try {
        await r2.send(new PutObjectCommand({
          Bucket: R2_BUCKET_DESTINO,
          Key: r2Key,
          Body: buffer,
          ContentType: contentType,
        }));
        console.log(`      ✅ ÉXITO: Subido a R2 en --> ${r2Key}`);
      } catch (upError) {
        console.error(`      ❌ Error subiendo a R2:`, upError);
      }
    }
  }
  
  console.log("\n🏁 --- MIGRACIÓN COMPLETADA ---");
}

migrar();