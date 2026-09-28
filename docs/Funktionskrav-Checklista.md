# Funktionskrav från PRD:n

FR-1: Produktkatalog (Översiktssida)
* [ ] Systemet ska visa alla tillgängliga produkter i ett responsivt rutnät (grid).
* [ ] Varje produktkort ska visa minst: bild, produktnamn, pris och kategori.
* [ ] Klick på ett produktkort ska leda direkt till produktens detaljsida.

FR-2: Dynamisk Detaljsida (/products/[id])
* [x] Systemet ska använda dynamiska rutter i Next.js App Router för att hämta och rendera information för en specifik vara.
* [x] Sidan ska visa utförlig information: titel, högupplöst bild, beskrivning, pris, kategori och lagerstatus/köpknapp.
* [ ] Felhantering: Om en produkt inte finns ska en användarvänlig 404/not-found-vy visas.

FR-3: Sök & Filtrering via URL State (searchParams)
* [ ] Användaren ska kunna söka på produktnamn samt filtrera på kategorier.
* [ ] Tillståndet för sök och filter måste lagras i URL:en med hjälp av searchParams (så att filtrerade sökningar kan bokmärkas och delas).
* [ ] Data ska hämtas/filtreras sömlöst på servern baserat på aktuella parametrar.

FR-4: Paginering
* [ ] Om katalogen innehåller fler varor än vad som ryms på en sida ska paginering finnas.
* [ ] Pagineringen ska styras via URL (?page=X) och möjliggöra bläddring framåt, bakåt och direktval av sida.

FR-5: Varukorg (Översiktsvy)
* [x] En dedikerad vy/sida för varukorgen som visar hur en sammanställning av ordervärde, produkter, antal och totalbelopp ser ut.
* [x] Basnivå: En statisk vy med exempelprodukter som demonstrerar kassan och layouten.
(Tips: Full dynamisk/persistent varukorg kan väljas som fördjupningsmodul).

Icke-funktionella krav (NFR)
* [ ] Prestanda & Bildoptimering: Använd Next.js inbyggda <Image />-komponent för optimerade bildstorlekar.
* [ ] Tillgänglighet & SEO: Semantisk HTML (<header>, <main>, <article>, <nav>), tydliga rubriknivåer (h1-h3) samt unika metadata-titlar per sida.
* [ ] Dokumentation: Repot ska ha en professionell och välstrukturerad README.md med installationsanvisningar, beskrivning av arkitektur och skärmdumpar.
