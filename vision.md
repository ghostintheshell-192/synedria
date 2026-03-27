# Synedria — Documento di Visione
**v0.4 — Marzo 2026 · Bozza di lavoro**

---

## 1. Il Problema

Imparare qualcosa di nuovo da soli è difficile. Non per mancanza di risorse — tutorial, corsi online e libri non sono mai stati così accessibili — ma per mancanza di contesto umano: qualcuno con cui confrontarsi, che ti tenga motivato, che sappia già qualcosa che tu non sai ancora.

I gruppi di studio informali esistono da sempre, ma nascono per caso — condividendo un banco, uno stesso corso universitario, un ufficio. Non esiste oggi uno strumento dedicato a formarli intenzionalmente, su base di interesse condiviso, tra persone che non si conoscono ancora.

In Italia e in Europa questo spazio è sostanzialmente vuoto. Le soluzioni esistenti (StudyStream, Focusmate, AcademyNC) sono tutte anglofone, pensate per studenti universitari americani, e puntano al remote-first. Nessuna favorisce l'incontro fisico, nessuna è progettata per un pubblico misto di giovani e professionisti.

---

## 2. La Visione

Synedria è una piattaforma per formare piccoli gruppi di studio intenzionali, costruiti su interessi e obiettivi condivisi, con una preferenza esplicita per l'incontro di persona.

Non è una piattaforma di e-learning. Non vende corsi. Non è una social network generica. È uno strumento per connettere persone che vogliono imparare la stessa cosa, nella stessa città, e studiare insieme — con o senza una guida, con o senza una scadenza.

La metafora di riferimento non è l'aula, è il **club di lettura**: piccolo, ricorrente, basato sulla fiducia costruita nel tempo, orientato a fare una cosa concreta insieme.

---

## 3. Target — Fase 1

La prima fase è orientata ai **giovani tra i 18 e i 30 anni**, con focus iniziale su percorsi tecnici (sviluppo, DevOps, cloud, ecc.). Il profilo tipico:

- Studia o ha appena finito di studiare, oppure lavora da poco
- Vuole imparare qualcosa di specifico — una tecnologia, una certificazione — ma non è iscritto a un corso formale
- Ha già provato a studiare da solo e sa che non funziona per lui/lei
- Vive in una città medio-grande e sarebbe disposto a incontrarsi di persona

Il target secondario, da sviluppare in una fase successiva, è il **professionista** che vuole aggiornarsi o acquisire una competenza nuova al di fuori del contesto lavorativo. L'espansione a domini non tecnici (lingue, discipline umanistiche, ecc.) è prevista ma posticipata.

---

## 4. La Meccanica Core

### 4.1 Profilo per competenza, non per ruolo

Ogni utente non è semplicemente "studente" o "esperto". Ha un profilo per ogni skill che dichiara, con tre dimensioni:

- **Livello attuale** — principiante / intermedio / avanzato
- **Intenzione** — vuole imparare / vuole insegnare / vuole lavorare su progetti insieme
- **Obiettivo concreto** *(opzionale)* — es. "prendere la certificazione AWS entro giugno"

La stessa persona può essere avanzata su DevOps e principiante su Python. Questo riflette come funziona l'apprendimento reale tra adulti, e crea dinamiche di gruppo più ricche rispetto alla gerarchia fissa mentor/studente.

> **Nota sul linguaggio:** il termine "mentor" è volutamente evitato. Implica una gerarchia e una responsabilità didattica che non corrisponde al modello — qui si è *co-learner* con livelli diversi, non insegnanti e alunni.

### 4.2 Scoperta e matching

La ricerca avviene per tag di competenza. Ogni risultato mostra utenti e gruppi già esistenti che cercano nuovi membri. I filtri principali:

- Competenza / tag di interesse
- Città o zona geografica
- Disponibilità oraria (fascia e giorni)
- Formato preferito — di persona / ibrido / solo online
- Dimensione ideale del gruppo — coppia, piccolo gruppo (3–4), aperto

### 4.3 Creazione del gruppo

Qualsiasi utente registrato può creare un gruppo. Non servono requisiti particolari — se cerchi un gruppo nella tua zona e non lo trovi, ne crei uno.

Al momento della creazione, il fondatore configura:

- Competenza / tag di interesse
- Obiettivo del gruppo (testo libero + eventuale certificazione dal catalogo)
- Città e zona
- Formato preferito — di persona / ibrido / solo online
- Modalità di ingresso — **approvazione attiva** *(default)* o accesso libero
- Descrizione di come funziona il gruppo (modalità di studio, clima, frequenza attesa)

Il default su approvazione attiva è una scelta deliberata: è più sicuro per la dinamica di un gruppo piccolo, e coerente col principio "piccolo è meglio". Chi vuole un gruppo aperto lo imposta esplicitamente.

Il fondatore è automaticamente il **referente** del gruppo — chi riceve le richieste di ingresso e gestisce la pagina. Il ruolo di referente può essere trasferito a qualsiasi altro membro attivo. Se il referente abbandona il gruppo senza trasferirlo, il membro con più anzianità nel gruppo viene promosso automaticamente.

### 4.4 Limite di dimensione

La dimensione raccomandata è **2–5 persone**. Il limite massimo è fissato a **8 membri** — oltre questa soglia le dinamiche cambiano: la conversazione diventa meno paritaria, il coordinamento più difficile, e il formato smette di essere un gruppo di studio per diventare un meetup. Il limite esiste per proteggere la natura del prodotto.

### 4.5 Ingresso nel gruppo

Quando un utente vuole unirsi a un gruppo con approvazione attiva:

1. Clicca "chiedi di entrare" dalla pagina del gruppo
2. Può scrivere un breve messaggio di presentazione *(opzionale)* — chi è, perché vuole unirsi
3. La piattaforma invia un'email al referente: "X vuole entrare nel tuo gruppo"
4. Il referente accede alla propria area riservata, vede la richiesta con il profilo di X e l'eventuale messaggio
5. Approva o rifiuta
6. Se approva, il nuovo membro entra nel gruppo e a quel punto i membri si scambiano i contatti per la comunicazione esterna

L'email del referente non viene mai esposta prima dell'approvazione. La piattaforma fa da intermediario — protegge entrambe le parti.

Per i gruppi ad accesso libero, il passaggio 2–5 è saltato: l'utente entra direttamente.

### 4.6 Uscita dal gruppo

Un membro può lasciare un gruppo in qualsiasi momento. I contributi pubblici (check-in, aggiornamenti di avanzamento) restano visibili nella storia del gruppo — fanno parte della vita del gruppo, non solo dell'individuo. Lo storico personale (gruppi frequentati, argomenti studiati, traguardi raggiunti) resta nel profilo dell'utente e lo segue.

### 4.7 Il gruppo sulla piattaforma

Quando un gruppo viene creato, la piattaforma ne mantiene una pagina pubblica minima con:

- Tag di competenza e obiettivo dichiarato
- Stato — **aperto** a nuovi membri / **chiuso**
- Tracciamento dell'avanzamento *(i gruppi scelgono quale approccio usare, o entrambi)*:
  - **Per accumulo** — "abbiamo coperto: containerizzazione, CI/CD, networking" *(non si può essere "indietro", si accumula sempre)*
  - **Per scadenza** — "settimana 4 di 10 verso la certificazione AWS" *(per chi ragiona per deadline)*
- Bacheca degli incontri passati — data, luogo indicativo, durata
- Luogo ricorrente *(opzionale)* — es. "Biblioteca Sormani, Milano"
- Check-in leggero post-incontro — una sola domanda ("vi siete incontrati?") per mantenere vivo il profilo

La **comunicazione interna** al gruppo avviene fuori dalla piattaforma (WhatsApp, Signal, ecc.). La piattaforma è il luogo dove il gruppo *esiste pubblicamente*, non dove comunica.

---

## 5. Integrazione con roadmap.sh

### Approccio scelto: link esterno, non import

I gruppi possono dichiarare di seguire una roadmap da [roadmap.sh](https://roadmap.sh) e la piattaforma mostra un link diretto alla roadmap corrispondente. Il contenuto rimane su roadmap.sh, Synedria non importa né replica nulla.

**Vantaggi:**
- Zero problemi di licenza *(la licenza di roadmap.sh vieta l'uso del contenuto fuori dal repository senza consenso esplicito)*
- roadmap.sh riceve traffico — è un incentivo per Kamran Ahmed a supportare l'integrazione
- Nessuna dipendenza runtime da mantenere

**Da fare:** contattare Kamran Ahmed (kamran@roadmap.sh) per presentare il progetto e ottenere un consenso formale, anche solo via email. Non è strettamente necessario per l'approccio link, ma è buona pratica e potrebbe aprire a una collaborazione futura.

### Espansione futura

Quando Synedria estenderà il proprio scope oltre i percorsi tecnici, si costruirà un sistema interno di "percorsi di apprendimento" ispirato al modello di roadmap.sh (nodi, prerequisiti, ordine consigliato) ma indipendente da esso.

---

## 6. Visibilità e SEO

### Profilo personale
Sempre **privato per i motori di ricerca**. Nome, competenze e città non vengono indicizzati.

### Pagina del gruppo
**Pubblica e indicizzabile per default**, con possibilità per il gruppo di chiuderla.

La logica: un gruppo aperto che cerca nuovi membri ha interesse a essere trovato anche su Google ("gruppo di studio DevOps Milano"). Un gruppo che ha già tutti i membri che vuole può disattivare l'indicizzazione. La scelta è legata a un'intenzione pratica, non a una preferenza astratta sulla privacy.

Le pagine dei gruppi attivi — con check-in regolari, avanzamento aggiornato, luogo ricorrente — producono contenuto fresco e unico, che è esattamente ciò che i motori di ricerca premiano nel tempo.

---

## 7. Principi di Design

- Ogni feature deve **ridurre l'attrito verso l'incontro fisico**, o rendere il gruppo più sano una volta che esiste. Se non fa né l'una né l'altra cosa, non va inclusa.
- **Niente chat interna** — crea un'alternativa all'incontro invece di favorirlo.
- **Niente gamification aggressiva** — attira comportamenti che ottimizzano per i punti, non per l'apprendimento.
- La **reputazione si costruisce attraverso l'attività visibile**, non attraverso giudizi espliciti. Vedi sezione 8.
- **Piccolo è meglio.** Gruppi da 2 a 5 persone (massimo 8), non community da 500.

---

## 8. Il Meccanismo di Reputazione

### Principio fondamentale: selezione per visibilità, non penalizzazione esplicita

Il sistema non chiede mai a nessuno di valutare un'altra persona. La reputazione emerge dall'attività — chi partecipa di più, impara di più, e viene invitato di nuovo è naturalmente più visibile. Chi contribuisce meno è automaticamente meno visibile, ma non è scoraggiato pubblicamente dal riprovare.

Questa distinzione è psicologicamente rilevante: la **punizione esplicita** (una stella bassa, un feedback negativo pubblico) attiva nei giovani adulti circuiti neurologici legati al dolore sociale e alla vergogna, e tende a produrre abbandono della piattaforma. L'**assenza di rinforzo** — semplicemente, sei meno visibile — non attiva quegli stessi meccanismi e lascia aperta la porta al miglioramento e al rientro. È particolarmente importante per il target 18-30 anni, che è in una fase identitaria ancora fluida e più reattivo al feedback negativo rispetto agli adulti con un concetto di sé stabilizzato.

### Cosa appare nel profilo pubblico — solo fatti verificabili

- Numero di gruppi completati
- Tasso di presenza agli incontri *(derivato dai check-in del gruppo, non dichiarato)*
- Argomenti studiati e traguardi raggiunti — es. "certificazione AWS ottenuta", "ha coperto moduli 1–6 della roadmap DevOps"
- Quante volte è stato invitato in nuovi gruppi da persone con cui ha già studiato *(segnale implicito fortissimo, senza nessuna valutazione esplicita)*

Nessun punteggio numerico. Nessuna stella. Nessuna classifica.

### Cosa il gruppo traccia durante il percorso

Ogni membro può aggiornare il proprio stato di avanzamento personale — "sono al punto X della roadmap", "ho completato il modulo Y". Questi aggiornamenti sono:

- Visibili agli altri membri del gruppo durante il percorso *(favoriscono micro-commitment e motivazione reciproca)*
- Opzionalmente resi pubblici a fine percorso come parte del profilo — "ho imparato / ripassato T e S", "ho ottenuto la certificazione Z"

Il focus è sempre su **cosa ho imparato**, non su come sono gli altri. Questo sposta l'attenzione dall'analisi relazionale all'auto-riflessione, che la letteratura mostra essere più onesta, meno minacciosa e più utile per la crescita.

### Il check-in di fine gruppo

Quando un gruppo si conclude, viene proposta una singola domanda a ciascun membro — privata, non pubblica:

> *"Studieresti di nuovo con le persone di questo gruppo?"* — Sì / Forse / No

Questa risposta non appare mai nel profilo di nessuno. Viene usata internamente per informare il sistema di matching futuro. La posta emotiva è bassa perché non è una recensione pubblica — è un'intenzione privata comunicata al sistema.

### Come il gruppo si descrive a chi vuole unirsi

Per aiutare i nuovi utenti a capire se un gruppo fa per loro — senza valutazioni interpersonali — ogni gruppo può dichiarare **come funziona**:

- Modalità di studio: *ognuno prepara e poi spiega agli altri / lavoriamo su progetti pratici / sessioni di domande e risposte a turno*
- Clima: *focus assoluto / abbastanza informale / ok qualche tangente*
- Frequenza attesa di presenza: *ogni incontro / flessibile*

Queste sono descrizioni di comportamenti e aspettative, non giudizi sulle persone. Permettono l'auto-selezione prima ancora del primo incontro, riducendo il rischio di mismatch e abbandono precoce.

### Cosa non c'è — e perché

- **Niente stelle o punteggi numerici** — producono inflazione (quasi tutto finisce tra 4 e 5) e giudizi globali sulla persona invece che sui comportamenti
- **Niente feedback pubblico testuale su singole persone** — il disagio di scrivere qualcosa di critico pubblicamente porta all'omissione o all'eufemismo, rendendo il sistema inutile
- **Niente valutazione delle competenze sociali** — essere tecnicamente capace e essere socialmente brillante sono dimensioni ortogonali. Un sistema che le confonde penalizza persone valide per ragioni sbagliate

---

## 9. Cosa Non È

- Non è una piattaforma di e-learning — non vende né ospita corsi
- Non è un tool di produttività — non è Focusmate, non fa body-doubling anonimo
- Non è una social network — niente feed, niente follower, niente like
- Non è LinkedIn — la reputazione non è autoreferenziale
- Non è Discord — non è pensato per community grandi e aperte

---

## 10. Certificazioni e Obiettivi

### Il catalogo delle certificazioni

I gruppi possono agganciare il proprio percorso a una certificazione ufficiale scelta da un catalogo interno curato. Il catalogo contiene le principali certificazioni tecniche — AWS, Google Cloud, Azure, Kubernetes (CNCF), HashiCorp, Red Hat, CompTIA, e altre — con nome, ente certificatore e link diretto al sito ufficiale.

Non è un'integrazione tecnica con API esterne — è una tabella mantenuta internamente, aggiornabile a mano. Le certificazioni tecniche rilevanti sono un insieme finito e relativamente stabile, gestibile senza automazione nella fase iniziale.

**Perché è utile:**
- Risolve un problema reale: trovare la fonte ufficiale di una certificazione tra corsi a pagamento, dump di esami e siti aggregatori non è immediato. Un link diretto e curato è un servizio genuino.
- Aggiunge concretezza all'obiettivo del gruppo — "stiamo lavorando per la CKA" è molto più leggibile di un tag generico "Kubernetes".
- Ha un vantaggio SEO naturale: una pagina dedicata a "gruppi che studiano per AWS Solutions Architect" con link all'ente ufficiale è contenuto specifico e utile, indicizzato bene.

Quando un gruppo dichiara una certificazione come riferimento, la pagina del gruppo mostra nome, ente e link ufficiale in modo prominente.

### Obiettivo del gruppo vs. obiettivo personale di ogni membro

La certificazione è l'obiettivo *del gruppo* — la direzione condivisa, il riferimento comune. Ma non è detto che tutti i membri la stiano inseguendo con la stessa intenzione.

Chi fonda il gruppo vuole prendere la certificazione. Chi si unisce potrebbe voler fare lo stesso, oppure voler consolidare fondamentali, oppure capire come si usa una tecnologia in contesti reali. Queste intenzioni diverse non sono un problema — sono spesso una risorsa. Chi punta alla certificazione studia con più rigore e porta struttura; chi ripassa consolida spiegando agli altri. È la stessa dinamica dell'effetto protégé: insegnare qualcosa rafforza la propria comprensione quanto, e a volte più, che studiarlo.

Il modo per gestirlo senza creare confusione è separare i due livelli:

**Obiettivo del gruppo** — tema, roadmap di riferimento, eventuale certificazione collegata. Visibile pubblicamente a chiunque.

**Obiettivo personale di ogni membro** — dichiarato da ciascuno al momento dell'iscrizione al gruppo. Esempi:
- "Voglio sostenere la certificazione entro giugno"
- "Voglio consolidare i fondamentali"
- "Voglio capire come si applica in produzione"
- "Sto ripassando dopo anni di pausa"

Gli obiettivi personali sono visibili agli altri membri del gruppo e a chi valuta se unirsi. Non sono un giudizio sul livello — sono un'informazione sul perché si è lì.

**Perché funziona:** chi guarda il gruppo da fuori vede subito la composizione delle intenzioni. Se tre persone puntano alla certificazione e una è lì per ripassare, lo sa prima del primo incontro e può decidere consapevolmente se è il posto giusto per sé. Questo riduce il rischio di mismatch e abbandono precoce, che è probabilmente la causa principale di gruppi che si sciolgono dopo due sessioni.

---

## 11. Posizione Geografica e Mappa

### Principio: la geografia è un filtro, non una feature

Synedria non è una piattaforma di scoperta geografica. La prossimità fisica è una condizione abilitante — permette di incontrarsi — ma non è il valore principale. Il valore è l'apprendimento condiviso con persone compatibili. La città è un filtro nella ricerca, non il centro dell'esperienza.

Mettere una mappa al centro dell'interfaccia sposterebbe l'attenzione degli utenti sulla dimensione sbagliata: "chi c'è vicino a me?" invece di "chi studia la stessa cosa che voglio studiare io?"

C'è anche un argomento pratico: nelle fasi iniziali, con pochi utenti, una mappa è controproducente. Tre pin sparsi su una città comunicano "questa piattaforma è vuota" molto più brutalmente di una lista testuale con tre risultati.

### Come appare la posizione

**Nel profilo del gruppo:** la posizione è indicata in chiaro come testo — "zona Navigli, Milano". Mai l'indirizzo esatto finché non c'è stato un contatto e una conferma reciproca tra le persone.

**Nella ricerca:** la città e il quartiere sono filtri tra gli altri — competenza, disponibilità oraria, formato. Non hanno una gerarchia visiva diversa dagli altri filtri.

**Nella pagina del singolo gruppo:** una piccola mappa statica e non interattiva che mostra il quartiere di riferimento. Non la posizione esatta — solo il contesto geografico. È utile perché l'utente è già lì, sta valutando quel gruppo specifico, e vedere "ah, è in questa zona" aiuta la decisione concreta senza esporre informazioni sensibili.

### Cosa non c'è nella fase 1 — e perché

Nessuna mappa interattiva generale con i pin dei gruppi. Diventa una feature utile solo quando c'è massa critica sufficiente in una città da rendere la mappa informativa. Prima di quel momento, è visivamente desolante e comunica scarsità invece che opportunità. Si aggiunge in una fase successiva, quando il prodotto è già cresciuto.

---

## 12. Stack Tecnologico

| Componente | Tecnologia | Ruolo |
|---|---|---|
| Frontend + API | Next.js | Interfaccia utente e logica server nello stesso progetto |
| Database + Auth + Sicurezza | Supabase | Backend completo — database PostgreSQL, autenticazione, controllo accessi |
| Deployment | Vercel | Hosting, HTTPS, aggiornamenti automatici da GitHub |
| Mappa di quartiere | Leaflet + OpenStreetMap | Mappa statica nella pagina del gruppo — gratuito, nessuna API key |

### Perché questo stack

**Supabase** risolve i tre problemi più insidiosi per chi costruisce un prodotto senza un team di backend dedicato: autenticazione sicura (incluso login con GitHub, naturale per il target tecnico), database relazionale strutturato, e sicurezza a livello di riga — significa che le regole "questo utente può vedere solo i suoi dati" si definiscono direttamente nel database, non nel codice applicativo dove è più facile sbagliare.

**Next.js** permette di scrivere frontend e logica server nello stesso progetto, senza gestire due repository separati. Le pagine pubbliche dei gruppi vengono renderizzate lato server, il che è necessario per la SEO.

**Vercel** è l'azienda che ha creato Next.js — l'integrazione è perfetta. Deployment automatico a ogni push su GitHub, HTTPS incluso, piano gratuito sufficiente per la fase iniziale.

**Leaflet + OpenStreetMap** per la mappa: nessun costo a consumo, nessuna API key da gestire, nessuna dipendenza da Google Maps o Mapbox.

---

## 13. Modello di Sostenibilità

### Principio: gratuito per gli utenti, sempre

Synedria è una community, non un prodotto SaaS. L'accesso non è condizionato al pagamento. Questo non è solo una scelta etica — è coerente con il valore del progetto: rendere l'apprendimento collaborativo accessibile a chi non può permettersi bootcamp o corsi costosi. Un modello freemium o a abbonamento selezionerebbe gli utenti per capacità economica, contraddicendo questo valore alla radice.

### Come si sostiene

La gratuità per gli utenti non significa che il progetto non abbia costi. La sostenibilità viene cercata altrove, da soggetti che hanno un interesse diretto nell'esistenza della community:

**Enti certificatori** — AWS, Google, CNCF e simili hanno interesse diretto che esistano community che aiutano le persone a prepararsi alle loro certificazioni. Sponsorship o partnership con questi enti sono la fonte più naturale e meno conflittuale con l'esperienza utente.

**Aziende tech che assumono** — una community di persone che stanno attivamente migliorando competenze tecniche è esattamente il pubblico che queste aziende cercano. Visibilità curata (non pubblicità invasiva) verso questo pubblico ha valore.

**Donazioni dalla community** — modello Wikipedia: chi ha beneficiato del progetto può scegliere di sostenerlo. Non obbligatorio, non condizionante.

### Cosa non si fa

Niente pubblicità comportamentale. Niente vendita di dati. Niente tier a pagamento che degradano l'esperienza di chi non paga.

---

## 14. Moderazione

### 14.1 Segnalazione utenti

Un pulsante "segnala" è presente nel profilo di ogni utente e nella pagina di ogni gruppo. La segnalazione apre un modulo con:

- **Categorie preimpostate** — spam, comportamento inappropriato, profilo falso, altro
- **Campo libero** per descrivere l'esperienza nel dettaglio

Le categorie permettono triage rapido man mano che le segnalazioni crescono; il campo libero cattura situazioni non previste. La segnalazione viene inviata al webmaster/team di moderazione. Nella fase 1 la gestione è manuale.

### 14.2 Ciclo di vita dei gruppi

#### Principio: soft delete con TTL

I gruppi inattivi non vengono penalizzati bruscamente — vengono prima nascosti, poi cancellati. I dati dell'utente sono sempre al sicuro fino alla cancellazione definitiva. Il meccanismo è automatico e basato su parametri combinati, non su un singolo segnale, per ridurre i falsi positivi.

#### Parametri di inattività

Un gruppo viene considerato inattivo quando si verificano *tutte* queste condizioni insieme:

- Nessun check-in negli ultimi 60 giorni
- Nessun aggiornamento dell'avanzamento negli ultimi 60 giorni
- Nessun membro ha fatto login negli ultimi 30 giorni

La combinazione è necessaria: un gruppo potrebbe non fare check-in ma i membri sono comunque attivi sulla piattaforma, o viceversa. Un singolo parametro produrrebbe troppi falsi positivi.

#### Il flusso

1. **Avviso** *(giorno 0)* — email ai membri: "il gruppo non risulta attivo da 60 giorni, tra 30 giorni non sarà più visibile nella ricerca"
2. **Invisibilità** *(giorno 30)* — il gruppo sparisce dalla ricerca e dalla homepage, ma la pagina esiste ancora per chi ha il link diretto
3. **Ultimo avviso** *(giorno 90)* — email: "i dati del gruppo verranno cancellati tra 30 giorni"
4. **Cancellazione** *(giorno 120)* — rimozione definitiva dal database

In totale circa **6 mesi** dalla prima inattività alla cancellazione — abbastanza generoso da non perdere gruppi che si prendono una pausa, abbastanza stringente da non accumulare dati inutili indefinitamente.

I membri possono riattivare il gruppo in qualsiasi momento prima della cancellazione definitiva — basta un check-in o un aggiornamento dell'avanzamento.

---

## 15. Registrazione e Identità

### Nessuna verifica identità nella fase 1

L'incentivo a creare account multipli su Synedria è quasi zero: non ci sono punti da accumulare, nessun ranking da scalare, nessun vantaggio competitivo da ottenere. E come osservazione pratica — non si può essere in due gruppi contemporaneamente con due identità diverse senza che diventi immediatamente evidente.

L'unico scenario teorico di abuso — gonfiare la propria reputazione con un secondo account — è neutralizzato dal fatto che il sistema di reputazione non ammette feedback espliciti da altri utenti. La reputazione emerge da comportamenti verificabili (presenze, check-in, inviti ricevuti), molto difficili da manipolare con account multipli.

Aggiungere un sistema di verifica identità nella fase 1 significherebbe aggiungere attrito alla registrazione senza risolvere un problema reale. Se in futuro emergesse un pattern di abuso specifico, si affronta allora con uno strumento mirato.

### Login sociale — tre provider

La registrazione avviene esclusivamente tramite login sociale, senza password da gestire. Supabase supporta tutti e tre nativamente come provider OAuth:

| Provider | Perché |
|---|---|
| **GitHub** | Naturale per il target tecnico; account solitamente esistenti da tempo, con attività reale — filtro implicito contro profili usa-e-getta |
| **Google** | Copertura universale per chi non usa GitHub |
| **Apple ID** | Necessario per gli utenti iOS, obbligatorio per le app su App Store |

Nessuna email + password. Nessuna gestione di reset password, nessun rischio di password deboli, nessuna superficie di attacco aggiuntiva. È più sicuro e più comodo per l'utente.

### Onboarding

Nessun tutorial guidato. Dopo il primo login, l'utente accede direttamente all'area riservata con tutte le funzionalità visibili. Un prompt discreto evidenzia le impostazioni da completare per essere trovato nella ricerca:

- **Almeno una competenza** con livello e intenzione — senza questa il matching non funziona
- **Città / zona** — necessaria per la ricerca geografica
- **Disponibilità oraria** — fascia e giorni

Il tono è un suggerimento, non un obbligo: "completa il tuo profilo per essere trovato da chi studia le tue stesse cose". L'utente può esplorare liberamente anche prima di completare il profilo, ma non comparirà nei risultati di ricerca finché le informazioni minime non sono presenti.

Un approccio soft è più coerente con un target tech 18-30: un tutorial passo-passo rischia di sembrare paternalistico per utenti che sanno già navigare un'interfaccia web.

---

## 16. Area di Lancio

### Milano e Lombardia

Il lancio è circoscritto a **Milano e alla Lombardia** — non per limitazione tecnica, ma per scelta strategica.

Milano è il centro tech italiano più denso: community attive, meetup frequenti, università come Polimi e Statale, una concentrazione alta di persone che lavorano in ambito tecnico o ci stanno entrando. È il contesto giusto per trovare early adopter che capiscono il prodotto e lo usano in modo genuino.

La Lombardia come area allargata copre naturalmente la cintura intorno a Milano — Varese, Como, Monza, Bergamo, Pavia — dove vivono molte persone che lavorano o studiano in città. Includere questa fascia dall'inizio evita di escludere utenti reali per un confine artificiale.

**Perché non nazionale dall'inizio:** lanciare su tutto il territorio distribuisce gli sforzi senza creare massa critica da nessuna parte. Una piattaforma di gruppi locali ha bisogno di densità geografica per funzionare — se ci sono tre utenti a Palermo e quattro a Torino, non si forma nessun gruppo. Meglio avere trenta utenti a Milano che si trovano davvero.

L'espansione ad altre città avviene quando Milano mostra segnali chiari di funzionamento: gruppi che si formano, si incontrano, completano percorsi.

---

## 17. Privacy e GDPR

Synedria opera nel mercato europeo e si conforma pienamente al GDPR. I punti chiave:

- **Cancellazione account** — l'utente può cancellare il proprio account in qualsiasi momento. I dati personali vengono rimossi; i contributi pubblici ai gruppi (check-in, avanzamento) vengono anonimizzati
- **Portabilità** — l'utente può esportare i propri dati in un formato leggibile
- **Consensi** — raccolti esplicitamente per ogni trattamento (email di notifica, visibilità del profilo ai membri del gruppo, ecc.)
- **Minimizzazione** — si raccolgono solo i dati strettamente necessari al funzionamento della piattaforma
- **Cookie e tracciamento** — nessun tracciamento comportamentale, nessun cookie di terze parti per advertising

L'implementazione dettagliata delle policy GDPR sarà definita nelle specifiche tecniche.

---

## 18. Internazionalizzazione

La piattaforma nasce con supporto multilingua predisposto fin dall'inizio — la struttura delle route i18n di Next.js viene impostata subito, anche se il contenuto iniziale è solo in italiano.

**Fase 1:** italiano e inglese. Il target è il territorio italiano, ma il pubblico tech spesso preferisce interfacce in inglese. Entrambe le lingue sono disponibili dal lancio.

**Fasi successive:** altre lingue in base all'espansione geografica.

---

## 19. Mobile

La fase 1 è esclusivamente **web responsive** — l'interfaccia funziona su mobile ma non esiste un'app nativa. L'investimento in un'app nativa (o PWA) è previsto in una fase successiva, quando la piattaforma web è stabile e validata.

L'inclusione di Apple ID tra i provider OAuth è in previsione di questa evoluzione futura.

---

## 20. Metriche di Successo

*TODO — da definire. Indicatori da considerare: numero di gruppi formati, tasso di completamento dei percorsi, frequenza degli incontri, retention degli utenti a 3/6 mesi, gruppi che si riformano con gli stessi membri.*

---

## 21. Domande Aperte

- **Nome del prodotto** — Synedria (dal greco συνέδρια, "sedersi insieme"). Domini: synedria.app (principale), synedria.it (mercato italiano)

---

*Documento di lavoro — da aggiornare iterativamente*
