const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// Image optimization configuration
const WEBP_QUALITY = 80;
const SIZES = {
    thumbnail: 400,
    medium: 800,
    full: 1920
};

// Images to optimize
const IMAGE_GROUPS = {
    logos: ['logo.png', 'logo-3d.png', 'apple-icon.png', 'apple-touch-icon.png'],
    maps: ['world-map-cyberpunk.png'],
    cubeFaces: [
        'cube-faces/ai.png',
        'cube-faces/cloud.png',
        'cube-faces/database.png',
        'cube-faces/kubernetes.png',
        'cube-faces/react.png',
        'cube-faces/security.png'
    ]
};

async function optimizeImage(inputPath, outputPath, options = {}) {
    const { width, quality = WEBP_QUALITY } = options;

    try {
        let pipeline = sharp(inputPath);

        if (width) {
            pipeline = pipeline.resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        await pipeline
            .webp({ quality })
            .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(2);

        console.log(`✓ ${path.basename(inputPath)} → ${path.basename(outputPath)}`);
        console.log(`  ${(inputStats.size / 1024).toFixed(2)}KB → ${(outputStats.size / 1024).toFixed(2)}KB (${reduction}% reduction)`);

        return { inputSize: inputStats.size, outputSize: outputStats.size };
    } catch (error) {
        console.error(`✗ Failed to optimize ${inputPath}:`, error.message);
        return { inputSize: 0, outputSize: 0 };
    }
}

async function processImageGroup(images, generateResponsive = false) {
    let totalInput = 0;
    let totalOutput = 0;

    for (const imagePath of images) {
        const fullInputPath = path.join(PUBLIC_DIR, imagePath);

        if (!fs.existsSync(fullInputPath)) {
            console.warn(`⚠ Skipping ${imagePath} (not found)`);
            continue;
        }

        // Generate WebP version at original size
        const outputPath = fullInputPath.replace(/\.png$/, '.webp');
        const { inputSize, outputSize } = await optimizeImage(fullInputPath, outputPath);
        totalInput += inputSize;
        totalOutput += outputSize;

        // Generate responsive sizes if requested
        if (generateResponsive) {
            for (const [sizeName, width] of Object.entries(SIZES)) {
                const responsiveOutput = fullInputPath.replace(/\.png$/, `-${sizeName}.webp`);
                const result = await optimizeImage(fullInputPath, responsiveOutput, { width });
                totalOutput += result.outputSize;
            }
        }
    }

    return { totalInput, totalOutput };
}

async function main() {
    console.log('🖼️  Starting image optimization...\n');

    let grandTotalInput = 0;
    let grandTotalOutput = 0;

    // Optimize logos (with responsive variants)
    console.log('📦 Processing logos...');
    const logoStats = await processImageGroup(IMAGE_GROUPS.logos, true);
    grandTotalInput += logoStats.totalInput;
    grandTotalOutput += logoStats.totalOutput;
    console.log('');

    // Optimize maps (single size, high quality)
    console.log('🗺️  Processing maps...');
    const mapStats = await processImageGroup(IMAGE_GROUPS.maps, false);
    grandTotalInput += mapStats.totalInput;
    grandTotalOutput += mapStats.totalOutput;
    console.log('');

    // Optimize cube face textures (critical for 3D performance)
    console.log('🎲 Processing 3D cube textures...');
    const cubeStats = await processImageGroup(IMAGE_GROUPS.cubeFaces, false);
    grandTotalInput += cubeStats.totalInput;
    grandTotalOutput += cubeStats.totalOutput;
    console.log('');

    // Summary
    const totalReduction = ((1 - grandTotalOutput / grandTotalInput) * 100).toFixed(2);
    console.log('✅ Optimization complete!');
    console.log(`📊 Total: ${(grandTotalInput / 1024 / 1024).toFixed(2)}MB → ${(grandTotalOutput / 1024 / 1024).toFixed(2)}MB`);
    console.log(`💾 Saved: ${((grandTotalInput - grandTotalOutput) / 1024 / 1024).toFixed(2)}MB (${totalReduction}% reduction)`);
}

main().catch(console.error);
