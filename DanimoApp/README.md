# Ejecutar
npm install / npm install --save-exact
npx expo install
npx expo prebuild --clean 
npx expo run:android 

### Si falla con cache corrupto de Gradle:
npx expo run:android --no-build-cache

### Hacer APK
npx expo prebuild --clean 
eas build -p android --profile production  

# FALLAS?

## Para cache corrupto de Gradle o problemas de build:
1. **Limpiar node_modules (usar robocopy para paths largos):**
   ```powershell
   mkdir empty_temp
   robocopy empty_temp node_modules /mir /njh /njs /ndl /nc /ns
   rmdir empty_temp
   ```

2. **Borrar package-lock.json:**
   ```powershell
   Remove-Item package-lock.json -Force
   ```

3. **Reinstalar dependencias:**
   ```powershell
   npm install
   npx expo install
   ```

4. **Prebuild limpio:**
   ```powershell
   npx expo prebuild --clean
   ```

5. **Ejecutar build:**
   ```powershell
   npx expo run:android
   ```

## Método original (para referencia):
Borrar node_modules 
Borrar package-lock.json