# Ejecutar
npm install
npm expo install
npx expo prebuild --clean 
npx expo run:android 
### Hacer APK
npx expo prebuild --clean 
eas build -p android --profile production  

# FALLAS?
Borrar node_modules 
Borrar package-lock.json
y ejecutar de 0 