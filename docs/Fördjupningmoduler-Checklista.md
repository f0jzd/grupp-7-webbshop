# Fördjupningsmoduler (Kundens Önskelista)

> 💡 **Riktlinje för teamet:**  
> Prioritera alltid **kvalitet och förståelse framför kvantitet**. En väl genomarbetad modul som alla i teamet förstår och kan förklara under redovisningen slår tre halvfärdiga moduler.

| Status | Modul | Svårighetsgrad | Inriktning & Rekommendation |
| :--- | :--- | :---: | :--- |
| **Finished** | ~~**📦 Persistent Varukorg**~~ | 🟢 Lätt / Medel | Spara varukorgens innehåll mellan sidladdningar och sessioner.<br>*(Rekommenderat: **Zustand med persist-middleware** eller Cookies. Mycket tacksamt då det sker helt i kodbasen utan externa API-konton).* |
| **Ongoing** | **🎨 Designsystem & UI** | 🟢 Lätt / Medel | Bygg ett enhetligt, tillgängligt och proffsigt gränssnitt.<br>*(Rekommenderat: **Shadcn/ui + Tailwind CSS**. Undvik att bygga all CSS från scratch för att spara tid).* |
| - | **📨 Transaktionell E-post** | 🟢 Lätt / Medel | Fungerande kontaktformulär eller orderbekräftelse via Next.js Server Actions.<br>*(Rekommenderat: **Resend**. Extremt smidigt i Next.js och kräver inga krångliga SMTP-inställningar).* |
| - | **🔐 Autentisering** | 🟡 Medel | Kundinloggning och skyddade rutter (*Mina sidor*, orderhistorik, favoriter).<br>*(Rekommenderat: **NextAuth**, **Kinde**, **BetterAuth** eller **Clerk** för snabbast och säkrast integration med Next.js App Router).* |
| - | **💳 Betallösning** | 🟡 Medel | Simulera ett riktigt köpflöde i testläge.<br>*(Rekommenderat: **Stripe Hosted Checkout**. Kunden omdirigeras till Stripes säkra sida och tillbaka, vilket minimerar komplexitet).* |
| **Planned** | **☁️ Databasmigration** | 🟡 Medel | Ersätt Fas 1:s JSON-server med en riktig molndatabas och ett modernt ORM.<br>*(Rekommenderat: **Supabase** eller **Neon PostgreSQL** kopplat med **Prisma** eller **Drizzle**).* |
| - | **🌍 Cloud Deployment** | 🟡 Medel | Publik driftsättning i produktionsmiljö.<br>*(Rekommenderat: **Vercel**. **Obs:** Kräver att er datakälla finns online och inte på `localhost:3001`!)* |

> ⚠️ **Arkitekturtips inför val av moduler:**  
> * **Säkra kort utan externa konton:** Om ni känner er osäkra eller vill minimera beroenden, välj **Persistent Varukorg (Zustand)** och **Designsystem (Shadcn/ui)**.  
> * **Deployment-fällan:** Om ni vill driftsätta på Vercel måste datan antingen migreras till en molndatabas (t.ex. Supabase) eller serveras via ett publikt API. Vercel kan inte prata med er lokala `json-server`.
