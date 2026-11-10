import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const native=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const app=resolve(native,'ios/App/App');
const plist=resolve(app,'Info.plist');
const delegate=resolve(app,'AppDelegate.swift');
try { await access(plist); await access(delegate); }
catch { throw Error('iOS-Projekt fehlt. Zuerst npm run ios:setup ausführen.'); }

function addPlistKey(xml,key,body) {
  if (xml.includes('<key>'+key+'</key>')) return xml;
  const pos=xml.lastIndexOf('</dict>');
  if(pos<0) throw Error('Info.plist nicht erkannt');
  return xml.slice(0,pos)+'\t<key>'+key+'</key>\n'+body+'\n'+xml.slice(pos);
}

let xml=await readFile(plist,'utf8');
xml=addPlistKey(xml,'NSCameraUsageDescription',
  '\t<string>Die Kamera wird benötigt, um Getränke-Barcodes bei Wareneingang, Umlagerung und Inventur zu scannen.</string>');

// The storyboard-based Capacitor 7 bridge must be owned by a UIWindowScene on iOS 27.
// Keep the existing Main storyboard and BridgeViewController, not a new empty window.
xml=addPlistKey(xml,'UIApplicationSceneManifest',`\t<dict>
\t\t<key>UIApplicationSupportsMultipleScenes</key>
\t\t<false/>
\t\t<key>UISceneConfigurations</key>
\t\t<dict>
\t\t\t<key>UIWindowSceneSessionRoleApplication</key>
\t\t\t<array>
\t\t\t\t<dict>
\t\t\t\t\t<key>UISceneConfigurationName</key>
\t\t\t\t\t<string>Default Configuration</string>
\t\t\t\t\t<key>UISceneDelegateClassName</key>
\t\t\t\t\t<string>$(PRODUCT_MODULE_NAME).SceneDelegate</string>
\t\t\t\t\t<key>UISceneStoryboardFile</key>
\t\t\t\t\t<string>Main</string>
\t\t\t\t</dict>
\t\t\t</array>
\t\t</dict>
\t</dict>`);
await writeFile(plist,xml);

let swift=await readFile(delegate,'utf8');
if(!swift.includes('class SceneDelegate:')) {
  swift += `

// UIScene support for iOS 27+. Kept in AppDelegate.swift so Capacitor's
// generated Xcode project compiles it without adding a new build-file entry.
class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?
}
`;
  await writeFile(delegate,swift);
}
console.log('iOS UIScene-Lebenszyklus und Kameraberechtigung konfiguriert.');
