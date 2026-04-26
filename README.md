# Tapahtumasovellus
 
Mobiiliohjelmointi-kurssin (SOF008AS3A-3018) lopputyö. Sovellus hakee Helsingin kaupungin tapahtumarajapinnasta tulevia tapahtumia ja mahdollistaa tapahtumien selaamisen, hakemisen sekä suosikkeihin tallentamisen.
 
## Teknologiat
 
### React Native & Expo
Sovellus on toteutettu **React Nativella** käyttäen **Expo**-alustaa. Expo tarjoaa kehitysympäristön sekä valmiita kirjastoja.
 
### React Navigation
Navigoinnissa käytetään **React Navigationia**, joka koostuu kahdesta osasta:
1. `@react-navigation/bottom-tabs` välilehtinavigointi: Tapahtumat / Suosikit
2. `@react-navigation/native-stack` pinonavigaatio tapahtumalistan ja tapahtumanäkymän välillä

### React Native Paper
Käyttöliittymäkomponentit on toteutettu **React Native Paper** -kirjastolla. Käytössä ovat mm. `Appbar`, `Card`, `Button`, `Searchbar`, `FAB`, `Text` ja `Divider`.
 
### Expo SQLite
Suosikit tallennetaan paikallisesti laitteelle **Expo SQLite** -tietokantaan. Tietokanta alustetaan sovelluksen käynnistyessä `SQLiteProvider`-komponentin kautta.
 
### Flash List
Tapahtumalistan renderöintiin käytetään **@shopify/flash-list**-komponenttia, joka on tavallista `FlatList`-komponenttia suorituskykyisempi vaihtoehto suurille listoille.
 
### Helsinki Events API
Tapahtumatiedot haetaan Helsingin kaupungin avoimesta **Linked Events** -rajapinnasta:
```
https://api.hel.fi/linkedevents/v1/event/
```
Tapahtumat haetaan sivutetusti ja suodatetaan niin, että näytetään vain tulevat tapahtumat.
 
### he
HTML-entiteettien purkamiseen käytetään **he**-kirjastoa. Tapahtumakuvaukset sisältävät HTML-tageja, jotka poistetaan ennen näyttämistä.
 
## Sovelluksen rakenne
 
| Tiedosto | Kuvaus |
|---|---|
| `App.js` | Juurikomponentti, navigointi ja tietokanta-alustus |
| `screens/EventListScreen.js` | Tapahtumalista, haku, vieritys |
| `screens/EventDetailScreen.js` | Tapahtuman tiedot, suosikkitoiminto |
| `screens/FavoritesScreen.js` | Tallennetut suosikit, haku |
| `components/EventCard.js` | Yksittäinen tapahtumakortti |
| `services/api.js` | Rajapintakutsu |
| `services/eventsCache.js` | Tapahtumien välimuisti |
| `services/locationCache.js` | Sijaintinimien välimuisti |
| `services/database.js` | SQLite-tietokantaoperaatiot |
| `utils/text.js` | HTML-tagien poisto ja entiteettien purku |
