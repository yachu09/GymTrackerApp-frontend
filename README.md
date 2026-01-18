Wymagane oprogramowania:
.NET SDK 8.0, 
Microsoft SQL Server,
node.js,
npm package manager

Instrukcja uruchomienia:
Aby uzyskać dostęp do bazy ćwiczeń należy pobrać backend z repozytorium: https://github.com/yachu09/GymTrackerApp-backend
Należy zmienić adres IP na którym nasłuchuje serwer API. W pliku launchSettings.json podmienić adresy http oraz https pod profilem "https":
<img width="2204" height="1390" alt="image" src="https://github.com/user-attachments/assets/374ed960-a8fd-4483-93af-adb6df56b8c9" />
Następnie w katalogu projektu: "dotnet build" aby zbudować projekt oraz "dotnet run --launch-profile https" aby uruchomić (baza ćwiczeń seedowana jest automatycznie)

Uruchomienie projektu w aplikacji mobilnej Expo Go:
Z repozytorium pobrać frontend a następnie zainstalować wszystkie zależnosći w folderze projektu komendą "npm install". 
Po zainstalowaniu zależności należy skonfigurować adres IP w instancji axios tak, aby zgadzał się z tym na którym nasłuchuje API (telefon i komputer muszą być w tej samej sieci wifi):
<img width="1811" height="796" alt="image" src="https://github.com/user-attachments/assets/ef15b0f8-a575-4da4-a404-891facfddcd9" />
Gdy powyższe czynności zostały wykonane można uruchomić Metro Bundler za pomocą komendy "npx expo start"
<img width="2202" height="1338" alt="image" src="https://github.com/user-attachments/assets/9d309883-8411-47a2-a372-5ac27ebdfea0" />
Telefonem z zainstalowaną aplikacją Expo Go skanujemy kod QR i projekt zostaje uruchomiony. 
