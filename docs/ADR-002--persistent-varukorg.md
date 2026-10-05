# ADR-2: Persistent varukorg

ADR-2: Persistent varukorg
Status: Beslutad
Datum: 2026-10-05
Deltagare: Georgij Li, Dmitry Alexandersson, Tomas Savela
Relaterad Issue/Ticket: #37
1. Kontext & Problemställning
Vilken utmaning eller vilket behov står vi inför? Vilka krav och begränsningar styr oss?

Kunder vill att innehåll i varukorgen sparas mellan sessioner. 

2. Övervägda Alternativ
Alternativ A: Spara varukorg i cookie i webbläsaren
Fördelar: Inbyggt i webbläsaren. Är en webbstandard. Behöver inte installera externa bibliotek.
Nackdelar: Cookies i webbläsare har en storleksbegränsning. Max 4kb.
Alternativ B: Spara varukorg i databas
Fördelar: Kan sparas mellan olika datorer och enheter.
Nackdelar: Funkar inte utan autentisering. Skulle behöva implementera autentisering för att få det att funka.
3. Beslut
Vilket alternativ valde vi och varför?

Vi valde alternativ A. Cookies i webbläsaren passar väl för att spara varukorgen då det är inbyggt i webbläsare och löser våra behov.
Sparar endast produkt id i varukorg cookien för att minska storleken på cookien.
Man slipper implementera autentisering och kan spara varukorgen i webbläsaren då cookies automatiskt skickas med till API-anrop.