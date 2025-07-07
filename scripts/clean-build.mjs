import { rm } from 'fs/promises';
import { join } from 'path';

// ビルド後に不要なファイルを削除してメモリ使用量を削減
const cleanBuild = async () => {
  const toDelete = [
    '.next/cache',
    '.next/server/chunks/babel-packages',
    '.next/server/amphtml-validator',
    '.open-next/cache',
    '.open-next/dynamodb-provider',
    'node_modules/@swc/core-linux-x64-gnu',
    'node_modules/@swc/core-linux-x64-musl',
  ];

  console.log('🧹 Cleaning build artifacts to reduce memory usage...');

  for (const path of toDelete) {
    try {
      await rm(join(process.cwd(), path), { recursive: true, force: true });
      console.log(`✓ Cleaned: ${path}`);
    } catch (error) {
      console.log(`- Skipped: ${path} (not found)`);
    }
  }

  console.log('✅ Build cleanup completed');
};

cleanBuild().catch(console.error);