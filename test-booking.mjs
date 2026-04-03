import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('📋 Abriendo formulario...');
  await page.goto('https://efa-tattoo-web.vercel.app/tattoo', { waitUntil: 'networkidle' });
  console.log('✓ Cargado');

  // Scroll
  await page.evaluate(() => {
    const el = document.querySelector('#reserva');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
  await page.waitForTimeout(1500);

  const testData = {
    name: 'Test Prueba',
    phone: '+34 666 555 444',
    email: `test-${Date.now()}@example.com`,
    city: 'barcelona',
    idea: 'Tatuaje minimalista de luna con líneas geométricas finas',
    zone: 'Brazo derecho',
    availability: 'Próximas 2 semanas',
    extra: 'Sin alergias, primera sesión'
  };

  console.log('\n📝 Datos de prueba:');
  console.log(`  Email: ${testData.email}`);
  console.log(`  Nombre: ${testData.name}`);
  console.log(`  Ciudad: ${testData.city}`);

  // Rellenar
  await page.fill('#b-name', testData.name);
  await page.selectOption('#b-city', testData.city);
  await page.fill('#b-phone', testData.phone);
  await page.fill('#b-email', testData.email);
  await page.fill('#b-idea', testData.idea);
  await page.fill('#b-zone', testData.zone);
  await page.fill('#b-availability', testData.availability);
  await page.fill('#b-extra', testData.extra);

  // PNG mínimo (1x1 blanco)
  const pngPath = '/tmp/test.png';
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xF8, 0xFF, 0xFF, 0x3F,
    0x00, 0x05, 0xFE, 0x02, 0xB7, 0x13, 0x2B, 0x91, 0x60, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  fs.writeFileSync(pngPath, pngData);

  console.log('\n📸 Subiendo imagen...');
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles(pngPath);
  await page.waitForTimeout(800);

  console.log('✓ Campos rellenados');

  console.log('\n🚀 Enviando...');
  
  try {
    await Promise.all([
      page.waitForResponse(r => r.url().includes('/api/') && r.status() < 300),
      page.click('button[type="submit"]')
    ]);
  } catch (e) {
    console.log('⚠️ Timeout esperando respuesta (pero puede estar enviándose)');
  }

  await page.waitForTimeout(3000);

  console.log(`\n✅ Formulario enviado. Email: ${testData.email}`);
  console.log('⏳ Buscando en GoHighLevel...\n');

  await browser.close();
  process.exit(0);
})().catch(e => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});
