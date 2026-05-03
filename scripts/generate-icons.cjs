// Genera todos los activos de imagen del PWA: iconos, favicon y og:image
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, '..', 'public');
const logoPath = path.join(publicDir, 'logo_transparent.png');

const CREAM = { r: 242, g: 235, b: 218, alpha: 1 };
const NAVY_BG = '#0F1738';
const RED = '#B8253A';

async function generatePwaIcon(size) {
  const padding = Math.round(size * 0.12);
  const logoSize = size - padding * 2;

  await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: 'contain', background: CREAM })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: CREAM })
    .png()
    .toFile(path.join(publicDir, `pwa-${size}.png`));

  console.log(`  ✓ pwa-${size}.png`);
}

async function generateAppleTouchIcon() {
  const size = 180;
  const padding = 18;
  const logoSize = size - padding * 2;

  await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: 'contain', background: CREAM })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: CREAM })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('  ✓ apple-touch-icon.png');
}

async function generateOgImage() {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  // Logo en la mitad derecha, texto en la izquierda
  const logoW = 420;
  const logoH = 420;
  const logoX = 740;
  const logoY = 105;

  const svg = `
<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <!-- Fondo navy -->
  <rect width="1200" height="630" fill="${NAVY_BG}"/>

  <!-- Franja roja izquierda -->
  <rect x="0" y="0" width="6" height="630" fill="${RED}"/>

  <!-- Nombre principal (acotado al lado izquierdo) -->
  <text
    x="70" y="230"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="68"
    font-weight="700"
    fill="#F2EBDA"
    letter-spacing="-1"
  >Hubert de Blanck</text>

  <!-- Línea decorativa bajo el nombre -->
  <rect x="70" y="252" width="140" height="4" fill="${RED}"/>

  <!-- Subtítulo -->
  <text
    x="70" y="318"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="28"
    fill="#F2EBDA"
    opacity="0.75"
    font-style="italic"
  >Compañía Teatral y Sala</text>

  <!-- Ciudad -->
  <text
    x="70" y="368"
    font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
    font-size="20"
    fill="#F2EBDA"
    opacity="0.5"
    letter-spacing="5"
  >LA HABANA</text>

  <!-- Fondo crema detrás del logo para que se vea bien sobre navy -->
  <rect x="${logoX}" y="${logoY}" width="${logoW}" height="${logoH}" fill="#F2EBDA" rx="4"/>

  <!-- Logo embebido (lado derecho) -->
  <image
    href="data:image/png;base64,${logoBase64}"
    x="${logoX}" y="${logoY}"
    width="${logoW}" height="${logoH}"
    preserveAspectRatio="xMidYMid meet"
  />

  <!-- Separador vertical sutil -->
  <rect x="700" y="60" width="1" height="510" fill="#F2EBDA" opacity="0.08"/>
</svg>`;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('  ✓ og-image.png (1200×630)');
}

async function generateFavicon() {
  // Favicon cuadrado mejorado: logo centrado sobre fondo crema con borde navy
  const size = 64;
  const padding = 6;
  const logoSize = size - padding * 2;

  await sharp(logoPath)
    .resize(logoSize, logoSize, { fit: 'contain', background: CREAM })
    .extend({ top: padding, bottom: padding, left: padding, right: padding, background: CREAM })
    .png()
    .toFile(path.join(publicDir, 'favicon-64.png'));

  // También 32px para mayor compatibilidad
  await sharp(logoPath)
    .resize(20, 20, { fit: 'contain', background: CREAM })
    .extend({ top: 6, bottom: 6, left: 6, right: 6, background: CREAM })
    .png()
    .toFile(path.join(publicDir, 'favicon-32.png'));

  console.log('  ✓ favicon-64.png + favicon-32.png');
}

(async () => {
  console.log('\nGenerando activos de imagen...\n');
  await generatePwaIcon(192);
  await generatePwaIcon(512);
  await generateAppleTouchIcon();
  await generateOgImage();
  await generateFavicon();
  console.log('\nListo. Todos los activos generados en /public\n');
})().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
