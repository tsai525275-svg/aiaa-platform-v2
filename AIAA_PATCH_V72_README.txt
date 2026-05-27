AIAA Patch V72

Purpose:
Fix the production build failure caused by committed patch/*.tsx files.

What it does:
1. Removes the patch directory from the project.
2. Keeps the real exam workspace EvidenceField arrays typed correctly.

Why:
Next.js TypeScript checking includes TSX files under the project. The patch/components copy still had the old V70 type error, so build failed even after the real component was fixed.

Run:
cd C:\src\aiaa-platform-v2
Expand-Archive -Path "$env:USERPROFILE\Downloads\aiaa_v71_patch_folder_build_fix_v72.zip" -DestinationPath "." -Force
node scripts\fix-v71-patch-build-v72.cjs
npm run build
