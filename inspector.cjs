// inspector.cjs
const { createClient } = require('@supabase/supabase-js');

// --- 1. TUS CLAVES REALES ---
const SUPABASE_URL = 'https://lndakyqyeusnmmsfyhwg.supabase.co'; 
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxuZGFreXF5ZXVzbm1tc2Z5aHdnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDQzOTYyMiwiZXhwIjoyMDgwMDE1NjIyfQ.0tf4VevRnzOJouU2ffQTLbAwgIha1X9kTquXxhey60s'; // Pega tu service_role key aquí

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Vamos a inspeccionar solo este bucket que sabemos que existe
const BUCKET_NAME = 'play-images'; 

async function inspeccionar() {
  console.log(`\n🕵️‍♂️ INSPECTOR: Iniciando análisis de [${BUCKET_NAME}]...\n`);

  // PRUEBA 1: Listar la Raíz
  console.log("--- PRUEBA 1: Buscando en la raíz ('') ---");
  const { data: rootData, error: rootError } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', { limit: 100, offset: 0, sortBy: { column: 'name', order: 'asc' } });

  if (rootError) {
    console.error("❌ Error leyendo raíz:", rootError);
  } else {
    console.log(`📊 La API devolvió ${rootData.length} elementos en la raíz.`);
    if (rootData.length > 0) {
      console.log("📝 Elementos encontrados:");
      console.log(rootData);
    } else {
      console.log("⚠️  La raíz parece vacía.");
    }
  }

  // PRUEBA 2: Intentar adivinar carpetas comunes
  // A veces los archivos están dentro de carpetas que la API no lista bien si no se lo pides
  const carpetasComunes = ['public', 'images', 'videos', 'uploads'];
  
  for (const carpeta of carpetasComunes) {
    console.log(`\n--- PRUEBA DE CARPETA: Buscando dentro de '${carpeta}/' ---`);
    const { data: folderData, error: folderError } = await supabase.storage
      .from(BUCKET_NAME)
      .list(carpeta);
      
    if (!folderError && folderData.length > 0) {
      console.log(`✅ ¡EUREKA! Encontrados ${folderData.length} archivos en '${carpeta}'`);
      console.log(folderData[0]); // Mostramos el primero de ejemplo
    } else {
      console.log(`   (Nada en ${carpeta})`);
    }
  }
}

inspeccionar();