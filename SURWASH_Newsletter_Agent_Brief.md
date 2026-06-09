# SURWASH Newsletter Website — Agent Brief & Content Package
**Prepared for:** AI Agent Implementation
**Project:** newsletter.surwash.ng
**Tech Stack:** Next.js + Sanity CMS + Vercel
**Date:** June 2026

---

## PART 1: NEW STRATEGIC DIRECTION

### What This Site Actually Is

This is **not a blog**. It is a **Newsletter Feed Archive** — a digital home for every newsletter edition SURWASH sends to its stakeholders. When the communications team sends a monthly email blast to ministers, commissioners, World Bank partners, state coordinators, and the public, the email contains short highlights and a link. That link brings stakeholders here to read the full content.

Think of it like an **online magazine archive**, not a news feed. Each edition has a month, a theme, and a collection of articles that belong to it.

---

### The Edition + Theme Model

Every SURWASH newsletter is published on a **bi-monthly basis** and organized around a **monthly theme** that gives the entire edition a narrative focus.

**Structure:**
```
Edition (e.g. March–April 2026)
  └── Theme: "Re-introducing SURWASH"
      └── Article 1: Re-Introducing SURWASH
      └── Article 2: Message from the Honourable Minister
      └── Article 3: Global Director's Visit to Plateau State
      └── Article 4: WASH Voices — Beneficiary Testimonials
      └── Article 5: What's Next for SURWASH
```

This means the **homepage** should display editions stacked chronologically (newest first), each showing:
- The edition month/year
- The theme name
- 3–5 article preview cards beneath it

Individual articles live at `/newsletter/[slug]` — NOT `/blog/[slug]`.

---

### `/blog` → `/newsletter` Slug Migration

**The current route is:** `/blog/[slug]`
**It must be changed to:** `/newsletter/[slug]`

#### Steps to execute:
1. Rename `app/blog/[slug]/page.tsx` → `app/newsletter/[slug]/page.tsx`
2. Rename `app/blog/page.tsx` → `app/newsletter/page.tsx` (if it exists)
3. Update all internal `href` references from `/blog/` to `/newsletter/`
4. Update Sanity slug prefix if it generates slugs with a `/blog/` base path
5. Add a permanent redirect (301) in `next.config.js`:

```js
// next.config.js
async redirects() {
  return [
    {
      source: '/blog/:slug*',
      destination: '/newsletter/:slug*',
      permanent: true,
    },
  ]
}
```

This ensures any old shared URLs don't break for stakeholders who already have them bookmarked.

---

### Sanity Schema Changes Required

#### New Document Type: `newsletterEdition`
```js
{
  name: 'newsletterEdition',
  title: 'Newsletter Edition',
  type: 'document',
  fields: [
    { name: 'title', title: 'Edition Title', type: 'string' },
    // e.g. "March – April 2026"
    { name: 'theme', title: 'Theme Name', type: 'string' },
    // e.g. "Re-introducing SURWASH"
    { name: 'themeDescription', title: 'Theme Description', type: 'text' },
    { name: 'month', title: 'Month (for sorting)', type: 'date' },
    { name: 'editionNumber', title: 'Edition Number', type: 'number' },
    { name: 'coverImage', title: 'Cover Image', type: 'image' },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ]
}
```

#### Update Existing `post` / `article` Schema
Add a reference field to link each article to its edition:
```js
{
  name: 'edition',
  title: 'Newsletter Edition',
  type: 'reference',
  to: [{ type: 'newsletterEdition' }]
}
```

#### Inline Image Support in Article Body
The article body uses Portable Text (`blockContent`). Ensure the `blockContent` schema includes an `image` type so editors can insert images between paragraphs:

```js
// In your blockContent.js schema
{
  type: 'image',
  options: { hotspot: true },
  fields: [
    {
      name: 'caption',
      type: 'string',
      title: 'Caption',
      options: { isHighlighted: true }
    },
    {
      name: 'alt',
      type: 'string',
      title: 'Alt Text',
      options: { isHighlighted: true }
    }
  ]
}
```

This allows comms to drop images anywhere inside the article body — between sections, after quotes, after statistics — not just as a banner at the top.

---

### Inline Images — Design Intent

Each article has:
1. **A banner/hero image** at the top (already exists)
2. **Inline images** embedded between content sections

**Where inline images should appear in these 5 articles:**

| Article | Suggested Image Placement |
|---|---|
| Re-Introducing SURWASH | After the 6-challenge infographic section; after the strategic pillars |
| Message from the Minister | Portrait photo of the Minister beside or above the letter |
| Global Director's Visit | Photo of Saroj Kumar Jha; photos of the treatment plant site visit |
| WASH Voices | Portrait/community photo above each testimonial |
| What's Next for SURWASH | Programme coordination photo (FPCU group photos) |

**In the renderer (`/newsletter/[slug]/page.tsx`)**, the Portable Text serializer must handle the `image` type:

```tsx
// In your PortableText components config
image: ({ value }) => (
  <figure className="my-8">
    <img
      src={urlFor(value).width(900).url()}
      alt={value.alt || ''}
      className="w-full rounded-lg object-cover"
    />
    {value.caption && (
      <figcaption className="mt-2 text-sm text-center text-gray-500">
        {value.caption}
      </figcaption>
    )}
  </figure>
)
```

---

### Homepage Layout (New Direction)

Instead of a flat list of articles, the homepage should render **grouped by edition**:

```
┌─────────────────────────────────────────┐
│  MARCH – APRIL 2026                     │
│  Theme: Re-introducing SURWASH          │
│  ─────────────────────────────          │
│  [Article Card] [Article Card]          │
│  [Article Card] [Article Card]          │
│  [Article Card]                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  MAY – JUNE 2026  (next edition)        │
│  Theme: TBD                             │
│  ...                                    │
└─────────────────────────────────────────┘
```

Each edition block links to a dedicated edition page at `/newsletter/editions/march-april-2026` which shows the full table of contents for that month.

---

## PART 2: THE 5 NEWSLETTER ARTICLES

*All content is sourced directly from the SURWASH Programme Bi-monthly Newsletter, Maiden Edition, March–April 2026.*
*Edition Theme: Re-introducing SURWASH*

---

### ARTICLE 1

**Title:** Re-Introducing SURWASH: Nigeria's Most Ambitious Water Reform Programme
**Slug:** `re-introducing-surwash`
**Category:** Federal / Programme Overview
**Excerpt:** Inadequate WASH conditions account for 73% of Nigeria's enteric disease burden — and over 255,000 preventable deaths every year. Here's the programme built to change that.

---

Nigeria is in a water crisis. Not a coming one — an active, documented, measurable one. Inadequate water, sanitation, and hygiene (WASH) conditions account for 73% of the total burden of enteric infections and disease in the country, resulting in over 255,000 preventable deaths annually. These are not projections. They are the baseline against which the SURWASH Programme measures its work.

The Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Programme is a flagship initiative of the Federal Ministry of Water Resources and Sanitation, implemented across fourteen states in partnership with the World Bank. Its mandate is clear: increase access to sustainable, climate-resilient WASH services while strengthening the institutions responsible for delivering them.

---

**[IMAGE: Nigeria WASH crisis infographic or water point photo]**
*Suggested caption: Inadequate WASH conditions affect millions of Nigerians across urban and rural communities.*

---

**The Scale of the Problem**

Six interlocking challenges define Nigeria's WASH emergency:

Nigeria currently spends only **0.32% of GDP** on the WASH sector annually. The African average is 0.7%, and at least 1.3% is required to meet SDG targets by 2030 — meaning Nigeria is investing at less than a quarter of what the goal demands.

**60 million Nigerians** lack access to basic drinking water. **46 million** still practise open defecation. **38%** of improved water points across the country are non-functional. Piped water access in urban areas collapsed from 32% in 1990 to just **7% in 2019**. Only 14% of schools and 7% of healthcare facilities have basic water supply and sanitation services.

Each of these figures represents a policy failure compounded over decades — and each represents a specific target the SURWASH Programme is designed to reverse.

---

**[IMAGE: Map of Nigeria showing SURWASH implementing states]**
*Suggested caption: SURWASH currently operates across 14 states, including 7 original implementing states and 7 newly onboarded states.*

---

**How SURWASH Is Structured**

The programme operates across four strategic pillars:

1. **Water Supply** — Expansion and rehabilitation of urban and rural systems
2. **Sanitation & Hygiene** — Ending open defecation and driving behaviour change through Social and Behavioural Change Communication (SBCC)
3. **Institutional Strengthening** — Governance reforms and utility performance improvement
4. **Performance-Based Financing (PforR)** — Results-driven disbursement; funds are released only when results are independently verified

This last pillar is what makes SURWASH structurally different from previous water sector investments. States that do not perform do not get paid.

**Who Is Involved**

Seven states are actively implementing: Katsina, Gombe, Kaduna, Ekiti, Plateau, Imo, and Delta. Seven additional states have been recently onboarded: Abia, Bauchi, Benue, Taraba, Ogun, Jigawa, and the FCT.

The programme is backed by a **$428 million World Bank loan** — $383 million under the PforR investment financing mechanism, and $45 million as Technical Assistance to bridge capacity gaps in implementing institutions.

---

**[IMAGE: Water treatment plant or construction site — Plateau State]**
*Suggested caption: Rehabilitation and construction of water treatment plants is one of the programme's key progress signals.*

---

**What Success Looks Like**

By the end of the programme, the targets are:
- **1,784,789 people** provided with basic drinking water services
- **11,000 people** connected to improved sanitation
- **120 communities** verified Open Defecation Free
- **765 schools and healthcare facilities** with improved WASH services

These are the numbers. The stories behind them are just beginning.

---

### ARTICLE 2

**Title:** "SURWASH Is Not Just a Programme — It Is a National Movement"
**Slug:** `message-from-the-honourable-minister`
**Category:** Federal / Leadership
**Excerpt:** The Honourable Minister of Water Resources and Sanitation opens the maiden edition of the SURWASH Newsletter with a charge to all stakeholders.

---

**[IMAGE: Portrait of Engr. Prof. Joseph Terlumun Utsev FNSE]**
*Suggested caption: Engr. Prof. Joseph Terlumun Utsev FNSE, Honourable Minister, Federal Ministry of Water Resources & Sanitation.*

---

*The following is the opening message from Engr. Prof. Joseph Terlumun Utsev FNSE, Honourable Minister, Federal Ministry of Water Resources and Sanitation, published in the maiden edition of the SURWASH Programme Newsletter.*

---

Dear Esteemed Stakeholders and Partners,

It is with great pride and a deep sense of responsibility that I present this edition of the Sustainable Urban and Rural Water Supply, Sanitation, and Hygiene (SURWASH) Programme Newsletter. This publication stands as a testament to the meaningful progress being achieved through collective commitment, strategic partnerships, and sustained investment in Nigeria's WASH sector.

The SURWASH Programme, a flagship initiative of the Federal Ministry of Water Resources and Sanitation, continues to drive transformative change across its implementing states — Ekiti, Delta, Gombe, Imo, Kaduna, Katsina, and Plateau. Through a performance-based financing approach, the Programme is not only delivering infrastructure but also strengthening institutions, enhancing service delivery systems, and ensuring that results are measurable, transparent, impactful, and sustainable.

With the recent onboarding of seven additional states — Abia, Bauchi, Benue, Taraba, Ogun, Jigawa, and the Federal Capital Territory — the SURWASH Programme is entering a new phase of expansion and consolidation. The Ministry holds high expectations for these new entrants to drive a measurable turnaround in the WASH sector through the rehabilitation and modernisation of critical infrastructure, alongside strengthened institutional frameworks for sustainable service delivery.

---

**[IMAGE: SURWASH Programme expansion map or official launch event photo]**
*Suggested caption: The SURWASH Programme has expanded to 14 states, marking a significant new phase for Nigeria's water sector reform.*

---

This expansion presents a unique opportunity to accelerate reforms, deepen impact, and reinforce a culture of accountability and performance across all participating states — ultimately advancing Nigeria's journey toward universal access to safe water, sanitation, and hygiene.

This edition highlights significant milestones: the commissioning and rehabilitation of critical urban and small towns water supply schemes, accelerated progress toward Open Defecation Free status in rural communities, and notable advancements in capacity building at both state and local levels.

Beyond infrastructure, SURWASH represents a broader reform agenda — one that prioritises accountability, encourages innovation, and fosters collaboration among government institutions, development partners, the private sector, and communities. It is through this coordinated effort that we are addressing long-standing challenges and building resilient systems capable of meeting current and future demands.

Looking ahead, the Ministry is committed to scaling up proven interventions, expanding the Programme's reach, and deepening stakeholder engagement to ensure no community is left behind. Our focus remains clear: to institutionalise reforms, sustain service delivery, and improve the quality of life for millions of Nigerians.

Together, we are laying a solid foundation for a healthier, more resilient, and economically productive nation — one community at a time. SURWASH is not just a programme. It is a national movement — driving transformation, restoring dignity, and securing a sustainable future for generations to come.

**Engr. Prof. Joseph Terlumun Utsev FNSE**
*Honourable Minister, Federal Ministry of Water Resources & Sanitation*

---

### ARTICLE 3

**Title:** A Global Endorsement: World Bank Director Visits Plateau State to Assess SURWASH Progress
**Slug:** `global-directors-visit-plateau-state`
**Category:** Spotlight / State Feature
**Excerpt:** Saroj Kumar Jha, Global Director for Water Global Practice at the World Bank, visited Plateau State this quarter — reaffirming international confidence in Nigeria's WASH reform journey.

---

Plateau State took centre stage this quarter as it hosted the World Bank's Global Director for Water Global Practice, **Saroj Kumar Jha**, on a strategic visit to assess on-the-ground progress under the SURWASH Programme.

The visit was more than a monitoring exercise. It was a signal — that the work being done in Plateau State is visible at the highest levels of international development finance, and that results are compelling enough to draw a global leader to verify them in person.

---

**[IMAGE: Saroj Kumar Jha portrait photo]**
*Suggested caption: Saroj Kumar Jha, Global Director for Water Global Practice, World Bank.*

---

**What the Delegation Saw**

During the visit, the delegation toured key water infrastructure sites across the **Jos-Bukuru axis**, including rehabilitated and newly constructed water treatment plants. The inspection gave the Global Director direct, unmediated visibility into how investments in infrastructure and institutional reform are translating into improved service delivery for real communities.

The visit included four key engagements:
- Inspection of upgraded water treatment facilities
- Direct interaction with community members now benefiting from improved services
- Structured engagement with state officials and water utility managers
- Reinforcement of accountability and performance-based financing principles

---

**[IMAGE: Water treatment plant site visit — Jos or Bukuru]**
*Suggested caption: The delegation inspected rehabilitated water treatment facilities across the Jos-Bukuru axis during the strategic visit.*

---

**What It Means**

The Global Director commended the Plateau State Government and its implementing agencies for their results-based implementation approach, and emphasised the importance of sustaining momentum — a pointed reminder that progress in infrastructure reform is not self-sustaining and requires continued institutional commitment.

The visit underscored what programme data has already confirmed: Plateau State is one of the leading examples of effective SURWASH implementation, particularly in infrastructure development and governance reform. The state has overseen:

- Rehabilitation of major treatment plants in **Jos and Bukuru**
- Strengthening of the **Plateau State Water Board**
- Expansion of distribution networks to previously under-served communities
- Measurable improvement in operational efficiency and service delivery

---

**[IMAGE: Community members accessing clean water / group photo with state officials]**
*Suggested caption: Community members across Plateau State are now experiencing improved access to clean water as a direct result of SURWASH investments.*

---

**A Validation, Not a Finish Line**

The significance of this visit lies not in what it concludes but in what it confirms: that performance-based reform in Nigeria's water sector is working, and that global development partners are watching, engaged, and prepared to deepen collaboration where results justify it.

For the communities now receiving reliable water from rehabilitated treatment plants across Plateau State, the visit is a reminder that their access to clean water is not merely a local achievement — it is part of a national reform story that the world is paying attention to.

---

### ARTICLE 4

**Title:** WASH Voices: What Clean Water and Safe Sanitation Actually Mean
**Slug:** `wash-voices-beneficiary-testimonials`
**Category:** Community / Human Interest
**Excerpt:** Four beneficiaries from Plateau State and Katsina State share what the SURWASH Programme has meant for their families, their health, and their communities.

---

Statistics tell one part of the SURWASH story. The people living it tell another. In communities across Plateau and Katsina States, residents are experiencing the direct impact of infrastructure investment, sanitation provision, and behavioural change programming. These are four of their voices.

---

**[IMAGE: Community members — women and children near a water point]**
*Suggested caption: Communities across Plateau and Katsina States are experiencing the human impact of SURWASH investments.*

---

**Ninfa Danjuma — Plateau State**

*On the SaTo pan sanitation initiative:*

> "The SaTo pan is a very good initiative which my family and I have been enjoying. There is a great difference compared to using a pit latrine. Previously, people defecated in the backyard, making us uncomfortable. Now, with the SaTo pan, our backyard is much cleaner. I advise others who can afford it to install one to make the environment cleaner and reduce open defecation. I've noticed fewer diseases caused by flies since the SaTo pan has a cover that prevents flies from carrying faeces to our food. I encourage everyone to not only install but continue using these toilets consistently."

---

**[IMAGE: SaTo pan product or clean sanitation facility]**
*Suggested caption: The SaTo pan initiative is improving sanitation standards and reducing disease transmission in communities across Plateau State.*

---

**Chundung Pam — Plateau State**

*On reliable water access in her community:*

> "We are immensely grateful for the SURWASH programme water project in our community. People can now access clean water and are delighted. The project has reduced diseases we previously faced from drinking contaminated water. Since the supply started, the water has flowed consistently. The water has been clean with no impurities. Our children no longer complain of certain ailments caused by dirty water, and hospital visits have decreased significantly. The pump has not broken down since installation, and we hope it continues working well."

---

**[IMAGE: Water pump or borehole in community setting]**
*Suggested caption: Consistent, clean water supply is reducing illness and improving quality of life for families in Plateau State.*

---

**Malam Umar Iro — Kafir, Katsina State**

*On latrine provision in his community:*

> "We extend our appreciation to the SURWASH programme and the Katsina State Government for providing latrines in our homes. This initiative represents a significant step towards ending open defecation in our community. We pledge to safeguard these projects from vandalism for the benefit of future generations."

---

**Musa Mamman Abu Baure — Baure, Katsina State**

*On the local economic impact of the programme:*

> "We are grateful to the Katsina State Government and World Bank for executing these vital projects and for employing local residents among the workers, which helps reduce unemployment in our area."

---

**[IMAGE: Local workers or construction crew at a SURWASH project site in Katsina]**
*Suggested caption: SURWASH projects are creating local employment opportunities in addition to delivering essential infrastructure.*

---

**A Pattern Across the Testimonies**

Read together, these four accounts point to something consistent: the impact of SURWASH is not abstract. Fewer hospital visits. Cleaner compounds. Children who no longer fall ill from dirty water. Young men employed in the construction and maintenance of the very infrastructure their families now depend on.

The programme's community engagement framework — which includes the establishment of **Water Consumer Associations (WCAs)**, **WASHCOMs**, and **Grievance Redress Committees (GRCs)** — is designed to ensure that these gains are protected, maintained, and owned by the communities that depend on them.

These voices are the measure of what the programme is for.

---

### ARTICLE 5

**Title:** What's Next: Seven Priorities Shaping SURWASH in the Coming Quarters
**Slug:** `whats-next-for-surwash`
**Category:** Programme Updates / Forward Look
**Excerpt:** From civil works expansion to policy reform, the SURWASH Programme has a clear forward agenda. Here is what stakeholders should expect in the months ahead.

---

The SURWASH Programme enters the next phase of its work from a position of demonstrated progress. Plateau State has hosted a World Bank Global Director and delivered verified infrastructure results. New states are onboarded and mobilising. The maiden edition of this newsletter is itself an accountability milestone — evidence that the programme is investing in its own transparency.

But the programme's leadership is focused forward. Seven key priorities will shape SURWASH's work in the coming quarters.

---

**[IMAGE: FPCU coordination meeting or workshop — Abuja]**
*Suggested caption: The Federal Programme Coordination Unit continues to provide technical oversight and implementation support across all participating states.*

---

**1. Expansion of Civil Works**

States including Ekiti are planning additional civil works to enhance programme impact and facilitate the next round of fund disbursement under the PforR mechanism. Expanded construction activity signals growing state confidence and a pipeline of new infrastructure for communities that have waited long enough.

**2. Strengthening WASH Data Systems**

The **WASH MAP training programme** will continue to roll out, with a particular focus on Kaduna State — equipping stakeholders across all Local Government Areas with skills to install, manage, and analyse WASH data.

**3. Stakeholder Engagement**

Ongoing stakeholder meetings will ensure that service delivery remains aligned with community needs and that communities retain meaningful ownership of the WASH facilities built in their areas. Ownership is the mechanism through which infrastructure is maintained.

**4. Capacity Building**

Continued training sessions are planned for water facility maintenance teams, WASH committees, and other relevant stakeholders. Infrastructure without institutional capacity degrades. SURWASH is building both simultaneously.

---

**[IMAGE: Training workshop — participants or capacity building session]**
*Suggested caption: Capacity building workshops equip state agency staff and community stakeholders with the skills to sustain WASH investments long-term.*

---

**5. Project Milestones and Inaugurations**

The coming months will see the commissioning of completed projects, the launch of new ones, and announcements of additional funding opportunities — the public accountability moments that connect programme investment to community outcomes.

**6. Evaluation of Additional States**

The **Federal Programme Implementation Unit (FPCU)** will continue evaluating the readiness of Technical Assistance-supported states and other interested states for potential inclusion. States must demonstrate institutional readiness to participate in a performance-based system.

**7. Policy and Institutional Reform**

Further development of water policies, service delivery models, and tariff structures designed to ensure the long-term sustainability of WASH services. Infrastructure without policy reform is a temporary fix. Sustainable access to water requires a regulatory environment that outlasts any single investment cycle.

---

**[IMAGE: Group photo — NPC Engr. Abdulhamid Gwaram with State Programme Coordinators]**
*Suggested caption: The National Programme Coordinator and State Programme Coordinators are aligned on a clear forward agenda for SURWASH's next phase.*

---

**The Momentum Is Real**

The Global Director's visit to Plateau State was a strong external validation of the progress SURWASH has made. But the programme's leadership is not resting on that validation. The focus ahead is on delivering sustainable, inclusive, and impactful WASH services at scale — in every participating state, in every community that has been promised access, and in every school and health facility that children and patients depend on.

The work continues.

---

## PART 3: IMPLEMENTATION CHECKLIST FOR AGENT

Use this as a sequential execution plan:

### Phase 1 — Sanity Schema Updates
- [ ] Create `newsletterEdition` document type with fields: `title`, `theme`, `themeDescription`, `month`, `editionNumber`, `coverImage`, `publishedAt`
- [ ] Add `edition` reference field to existing `post`/`article` schema
- [ ] Add `image` block type to `blockContent` portable text schema (with `caption` and `alt` fields)
- [ ] Verify image upload and inline rendering works in Sanity Studio

### Phase 2 — Route Migration
- [ ] Rename `app/blog/[slug]/` → `app/newsletter/[slug]/`
- [ ] Update all internal `href` values from `/blog/` to `/newsletter/`
- [ ] Add 301 redirect in `next.config.js` from `/blog/:slug*` → `/newsletter/:slug*`
- [ ] Update any Sanity slug generation config to use `/newsletter/` base

### Phase 3 — Homepage Redesign
- [ ] Update homepage GROQ query to fetch articles grouped by `newsletterEdition`
- [ ] Build edition grouping component that shows theme name + article cards per edition
- [ ] Add edition landing page at `/newsletter/editions/[edition-slug]`

### Phase 4 — Article Page Updates
- [ ] Update Portable Text serializer to render inline `image` blocks with caption support
- [ ] Ensure image rendering is responsive and styled consistently with the site design
- [ ] Add edition breadcrumb/tag to article header (e.g. "March–April 2026 · Re-introducing SURWASH")

### Phase 5 — Content Entry (March–April 2026 Edition)
- [ ] Create `newsletterEdition` entry: "March–April 2026", Theme: "Re-introducing SURWASH"
- [ ] Enter Article 1: `re-introducing-surwash` — link to edition, add inline image placeholders
- [ ] Enter Article 2: `message-from-the-honourable-minister` — link to edition, add Minister portrait
- [ ] Enter Article 3: `global-directors-visit-plateau-state` — link to edition, add site visit photos
- [ ] Enter Article 4: `wash-voices-beneficiary-testimonials` — link to edition, add community photos
- [ ] Enter Article 5: `whats-next-for-surwash` — link to edition, add FPCU workshop photos

---

## PART 4: INLINE IMAGE PLACEMENT GUIDE

For every article, images should be inserted at these natural content breaks:

### General Rule
- **1 hero/banner image** at the top of the article (already supported)
- **1 inline image every 3–4 paragraphs** within the body
- Images should relate directly to the content of the section they appear in
- Every image must have an `alt` text and optional `caption`

### Recommended Image Sources
All images are available from the printed newsletter PDF and FPCU photo archive:
- Water treatment plant photos (Jos, Bukuru)
- FPCU workshop group photos (Bon Elvis Hotel, Exclusive Hotel, Abuja)
- WASH IEC Materials launch event (Royal Choice Inn Hotel)
- WB team + NPC group photos
- Community beneficiary photos (Plateau State, Katsina State)
- Portrait: Saroj Kumar Jha (World Bank Global Director)
- Portrait: Engr. Prof. Joseph Terlumun Utsev (Minister)
- Portrait: Engr. Abdulhamid A. Gwaram (National Programme Coordinator)

---

*End of Agent Brief. All article content is sourced from the SURWASH Programme Newsletter, Maiden Edition, March–April 2026. Published by the Federal Programme Coordination Office, C/O Office of the National Coordinator, No. 15 Ajesa Street, Wuse II, Abuja. Printed by Takeout Media. Copyright © April 2026.*
