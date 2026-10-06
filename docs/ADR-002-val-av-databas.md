# 🏛️ Architecture Decision Record (ADR) Mall

> **Vad är en ADR?**  
> En ADR (Architecture Decision Record) är ett kortfattat dokument som fångar ett viktigt arkitektur- eller teknikbeslut, kontexten kring beslutet och dess konsekvenser. Spara era beslut i mappen `docs/` med namn som `ADR-001-val-av-databas.md`.

> ⚖️ **Tumregel: När ska vi skriva en ADR i detta projekt?**  
> * **Skriv INTE en ADR för allt!** Ni ska **endast skriva 1 (max 2) ADR:er för hela projektet**.
> * **Var?** Skriv den uteslutande för era **valbara fördjupningsmoduler** eller ert största tekniska vägval (t.ex. *Val av state-hantering för varukorg*, *Val av Auth-tjänst*, eller *Val av molndatabas*).
> * **När behövs INTE en ADR?** Skriv aldrig en ADR för UI-styling, vanliga React-komponenter, sidlayouter eller buggfixar.

---

# ADR-[Val av databas för Databas Migration]:

* **Status:** [Beslutad]
* **Datum:** 2026-09-22
* **Deltagare:** Georgij Li, Dmitry Alexandersson, Tomas Savela
* **Relaterad Issue/Ticket:** #110

---

## 1. Kontext & Problemställning

Innan implementation av en databas och databas migration så hanteras produkterna och katalogen via en lokal JSON fil. Detta gör så att man alltid måste köra båda delarna på samma ställe. Databas flyttar självaste backend delen till ett annat ställe så man endast behöver köra frontend delen lokalt medans databasen hanterar backend delen.


---

## 2. Övervägda Alternativ

### Alternativ A: [Supabase]
* **Fördelar:** Web UI, Auth, File Storage, enkel JS client, bra Next.js docs..
* **Nackdelar:** Pausar free projects efter 7 dagar av inaktivitet (kan unpausas med 1 click).

### Alternativ B: [Neon]
* **Fördelar:** Database Branching (varje Git branch/PR kan ha sin egna isolerade kopia av DB:n).
* **Nackdelar:** Endast databasen, ingen inbyggt auth, storage eller admin UI (paras oftast med Prisma/Drizzle).

### Alternativ C: [MongoDB Atlas]
* **Fördelar:** Native JSON dokument model, flexibel schema.
* **Nackdelar:** Kan vara stökigt för relational features som kopplingar mellan categories, products, och t.ex. orders.

### Alternativ D: [Firebase]
* **Fördelar:** Bra ekosystem, Google backning
* **Nackdelar:** Relational queries (filtrering av produkter med category + search + pagination) kan vara lite awkward i Firestore.

---

## 3. Beslut

Vi beslöt oss att använda Supabase för det fanns bra funktioner, bra dokumentation och kan kombineras med AUTH om det var något vi ville lägga till. Det gick också att kombinera med prisma eller med deras inbyggda.

---

## 4. Konsekvenser

### Positiva konsekvenser

* Vi får ett och samma ställe att hantera våra produkter istället för att ha varsin json fil som kontrollerar våra produkter.
* Eftersom den är server baserad så går den faktiskt att använda i verkliga scenarion istället för en lokal JSON fil.


### Negativa konsekvenser / Risker

* Alla anrop till JSON filen måste bytas till server calls istället.
* Inte alla i gruppen är vana med Supabase/ databas hantering och finns möjlighet för problem eller väggar att uppstå pga det.

---

## 5. Hur vi verifierar beslutet

* [ ] Varor kan läggas till och tas bort från både produktsida och kassa via anrop till server istället för JSON fil.
* [ ] Varor uppdateras när dem ändras via admin sidan.