import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const native=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const plist=resolve(native,'ios/App/App/Info.plist');
try{await access(plist)}catch{throw Error('iOS-Projekt fehlt. Zuerst npm run ios:setup ausführen.')}
let xml=await readFile(plist,'utf8');
if(!xml.includes('<key>NSCameraUsageDescription</key>')){
 const marker='</dict>';
 const pos=xml.lastIndexOf(marker);
 if(pos<0)throw Error('Info.plist nicht erkannt');
 xml=xml.slice(0,pos)+'\t<key>NSCameraUsageDescription</key>\n\t<string>Die Kamera wird benötigt, um Getränke-Barcodes bei Wareneingang, Umlagerung und Inventur zu scannen.</string>\n'+xml.slice(pos);
 await writeFile(plist,xml);
}
console.log('Kameraberechtigung für Xcode vorbereitet.');
