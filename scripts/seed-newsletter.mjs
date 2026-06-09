/**
 * SURWASH Newsletter Seed Script
 * Creates the March-April 2026 edition + 5 articles in Sanity CMS
 * Run with: node scripts/seed-newsletter.mjs
 */

import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '0qnyls1e',
  dataset: 'production',
  apiVersion: '2023-05-03',
  token: 'skak6OZfEGLIl5OVRvy7hJLMxGMeITW6Q2vqUXpF06o8Jyj5zAAgF4eKqKT0yOMuO386AeAhWrPB00lXcZvlMs5ZhEBb48CQyjRbuWOd9YTCSB2w6MSqPGBV5DPGUlrGZSarIuKTXPWWmToXzoklNGsYcxbQPG57cdqGkRGtSWS5sn8dLKP2',
  useCdn: false,
});

// Helper to create a Portable Text block
function block(text, style = 'normal') {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: [] }],
  };
}

function boldSpan(text) {
  return { _type: 'span', _key: Math.random().toString(36).slice(2), text, marks: ['strong'] };
}

function mixedBlock(...spans) {
  return {
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    markDefs: [],
    children: spans.map(s =>
      typeof s === 'string'
        ? { _type: 'span', _key: Math.random().toString(36).slice(2), text: s, marks: [] }
        : s
    ),
  };
}

function heading(text, level = 'h2') {
  return block(text, level);
}

function quote(text) {
  return block(text, 'blockquote');
}

function bulletList(items) {
  return items.map(item => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: typeof item === 'string'
      ? [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: item, marks: [] }]
      : item,
  }));
}

function numberedList(items) {
  return items.map(item => ({
    _type: 'block',
    _key: Math.random().toString(36).slice(2),
    style: 'normal',
    listItem: 'number',
    level: 1,
    markDefs: [],
    children: typeof item === 'string'
      ? [{ _type: 'span', _key: Math.random().toString(36).slice(2), text: item, marks: [] }]
      : item,
  }));
}

// ─────────────────────────────────────────────
// STEP 1: Create the Newsletter Edition
// ─────────────────────────────────────────────
async function createEdition() {
  console.log('⏳ Creating Newsletter Edition: March – April 2026...');

  const existing = await client.fetch(
    `*[_type == "newsletterEdition" && slug.current == "march-april-2026"][0]._id`
  );

  if (existing) {
    console.log('✅ Edition already exists, using existing ID:', existing);
    return existing;
  }

  const edition = await client.create({
    _type: 'newsletterEdition',
    title: 'March – April 2026',
    slug: { _type: 'slug', current: 'march-april-2026' },
    theme: 'Re-introducing SURWASH',
    themeDescription:
      'The maiden edition of the SURWASH Newsletter introduces the programme to its stakeholders — covering its scale, structure, international endorsement, community impact, and forward agenda.',
    month: '2026-03-01',
    editionNumber: 1,
    publishedAt: '2026-04-30T00:00:00.000Z',
  });

  console.log('✅ Edition created:', edition._id);
  return edition._id;
}

// ─────────────────────────────────────────────
// STEP 2: Article content builders
// ─────────────────────────────────────────────

function article1Content() {
  return [
    block(
      "Nigeria is in a water crisis. Not a coming one — an active, documented, measurable one. Inadequate water, sanitation, and hygiene (WASH) conditions account for 73% of the total burden of enteric infections and disease in the country, resulting in over 255,000 preventable deaths annually. These are not projections. They are the baseline against which the SURWASH Programme measures its work."
    ),
    block(
      "The Sustainable Urban and Rural Water Supply, Sanitation and Hygiene (SURWASH) Programme is a flagship initiative of the Federal Ministry of Water Resources and Sanitation, implemented across fourteen states in partnership with the World Bank. Its mandate is clear: increase access to sustainable, climate-resilient WASH services while strengthening the institutions responsible for delivering them."
    ),
    heading('The Scale of the Problem'),
    block("Six interlocking challenges define Nigeria's WASH emergency:"),
    mixedBlock(
      'Nigeria currently spends only ',
      boldSpan('0.32% of GDP'),
      ' on the WASH sector annually. The African average is 0.7%, and at least 1.3% is required to meet SDG targets by 2030 — meaning Nigeria is investing at less than a quarter of what the goal demands.'
    ),
    mixedBlock(
      boldSpan('60 million Nigerians'),
      ' lack access to basic drinking water. ',
      boldSpan('46 million'),
      ' still practise open defecation. ',
      boldSpan('38%'),
      ' of improved water points across the country are non-functional. Piped water access in urban areas collapsed from 32% in 1990 to just ',
      boldSpan('7% in 2019'),
      '. Only 14% of schools and 7% of healthcare facilities have basic water supply and sanitation services.'
    ),
    block(
      "Each of these figures represents a policy failure compounded over decades — and each represents a specific target the SURWASH Programme is designed to reverse."
    ),
    heading('How SURWASH Is Structured'),
    block('The programme operates across four strategic pillars:'),
    ...numberedList([
      'Water Supply — Expansion and rehabilitation of urban and rural systems',
      'Sanitation & Hygiene — Ending open defecation and driving behaviour change through Social and Behavioural Change Communication (SBCC)',
      'Institutional Strengthening — Governance reforms and utility performance improvement',
      'Performance-Based Financing (PforR) — Results-driven disbursement; funds are released only when results are independently verified',
    ]),
    block(
      "This last pillar is what makes SURWASH structurally different from previous water sector investments. States that do not perform do not get paid."
    ),
    heading('Who Is Involved'),
    block(
      "Seven states are actively implementing: Katsina, Gombe, Kaduna, Ekiti, Plateau, Imo, and Delta. Seven additional states have been recently onboarded: Abia, Bauchi, Benue, Taraba, Ogun, Jigawa, and the FCT."
    ),
    mixedBlock(
      'The programme is backed by a ',
      boldSpan('$428 million World Bank loan'),
      ' — $383 million under the PforR investment financing mechanism, and $45 million as Technical Assistance to bridge capacity gaps in implementing institutions.'
    ),
    heading('What Success Looks Like'),
    block('By the end of the programme, the targets are:'),
    ...bulletList([
      '1,784,789 people provided with basic drinking water services',
      '11,000 people connected to improved sanitation',
      '120 communities verified Open Defecation Free',
      '765 schools and healthcare facilities with improved WASH services',
    ]),
    block('These are the numbers. The stories behind them are just beginning.'),
  ];
}

function article2Content() {
  return [
    block(
      "It is with great pride and a deep sense of responsibility that I present this edition of the Sustainable Urban and Rural Water Supply, Sanitation, and Hygiene (SURWASH) Programme Newsletter. This publication stands as a testament to the meaningful progress being achieved through collective commitment, strategic partnerships, and sustained investment in Nigeria's WASH sector."
    ),
    block(
      "The SURWASH Programme, a flagship initiative of the Federal Ministry of Water Resources and Sanitation, continues to drive transformative change across its implementing states — Ekiti, Delta, Gombe, Imo, Kaduna, Katsina, and Plateau. Through a performance-based financing approach, the Programme is not only delivering infrastructure but also strengthening institutions, enhancing service delivery systems, and ensuring that results are measurable, transparent, impactful, and sustainable."
    ),
    block(
      "With the recent onboarding of seven additional states — Abia, Bauchi, Benue, Taraba, Ogun, Jigawa, and the Federal Capital Territory — the SURWASH Programme is entering a new phase of expansion and consolidation. The Ministry holds high expectations for these new entrants to drive a measurable turnaround in the WASH sector through the rehabilitation and modernisation of critical infrastructure, alongside strengthened institutional frameworks for sustainable service delivery."
    ),
    block(
      "This expansion presents a unique opportunity to accelerate reforms, deepen impact, and reinforce a culture of accountability and performance across all participating states — ultimately advancing Nigeria's journey toward universal access to safe water, sanitation, and hygiene."
    ),
    block(
      "This edition highlights significant milestones: the commissioning and rehabilitation of critical urban and small towns water supply schemes, accelerated progress toward Open Defecation Free status in rural communities, and notable advancements in capacity building at both state and local levels."
    ),
    block(
      "Beyond infrastructure, SURWASH represents a broader reform agenda — one that prioritises accountability, encourages innovation, and fosters collaboration among government institutions, development partners, the private sector, and communities. It is through this coordinated effort that we are addressing long-standing challenges and building resilient systems capable of meeting current and future demands."
    ),
    block(
      "Looking ahead, the Ministry is committed to scaling up proven interventions, expanding the Programme's reach, and deepening stakeholder engagement to ensure no community is left behind. Our focus remains clear: to institutionalise reforms, sustain service delivery, and improve the quality of life for millions of Nigerians."
    ),
    block(
      "Together, we are laying a solid foundation for a healthier, more resilient, and economically productive nation — one community at a time. SURWASH is not just a programme. It is a national movement — driving transformation, restoring dignity, and securing a sustainable future for generations to come."
    ),
    block('Engr. Prof. Joseph Terlumun Utsev FNSE', 'h3'),
    block('Honourable Minister, Federal Ministry of Water Resources & Sanitation'),
  ];
}

function article3Content() {
  return [
    block(
      "Plateau State took centre stage this quarter as it hosted the World Bank's Global Director for Water Global Practice, Saroj Kumar Jha, on a strategic visit to assess on-the-ground progress under the SURWASH Programme."
    ),
    block(
      "The visit was more than a monitoring exercise. It was a signal — that the work being done in Plateau State is visible at the highest levels of international development finance, and that results are compelling enough to draw a global leader to verify them in person."
    ),
    heading('What the Delegation Saw'),
    block(
      "During the visit, the delegation toured key water infrastructure sites across the Jos-Bukuru axis, including rehabilitated and newly constructed water treatment plants. The inspection gave the Global Director direct, unmediated visibility into how investments in infrastructure and institutional reform are translating into improved service delivery for real communities."
    ),
    block('The visit included four key engagements:'),
    ...bulletList([
      'Inspection of upgraded water treatment facilities',
      'Direct interaction with community members now benefiting from improved services',
      'Structured engagement with state officials and water utility managers',
      'Reinforcement of accountability and performance-based financing principles',
    ]),
    heading('What It Means'),
    block(
      "The Global Director commended the Plateau State Government and its implementing agencies for their results-based implementation approach, and emphasised the importance of sustaining momentum — a pointed reminder that progress in infrastructure reform is not self-sustaining and requires continued institutional commitment."
    ),
    block(
      "The visit underscored what programme data has already confirmed: Plateau State is one of the leading examples of effective SURWASH implementation, particularly in infrastructure development and governance reform. The state has overseen:"
    ),
    ...bulletList([
      'Rehabilitation of major treatment plants in Jos and Bukuru',
      'Strengthening of the Plateau State Water Board',
      'Expansion of distribution networks to previously under-served communities',
      'Measurable improvement in operational efficiency and service delivery',
    ]),
    heading('A Validation, Not a Finish Line'),
    block(
      "The significance of this visit lies not in what it concludes but in what it confirms: that performance-based reform in Nigeria's water sector is working, and that global development partners are watching, engaged, and prepared to deepen collaboration where results justify it."
    ),
    block(
      "For the communities now receiving reliable water from rehabilitated treatment plants across Plateau State, the visit is a reminder that their access to clean water is not merely a local achievement — it is part of a national reform story that the world is paying attention to."
    ),
  ];
}

function article4Content() {
  return [
    block(
      "Statistics tell one part of the SURWASH story. The people living it tell another. In communities across Plateau and Katsina States, residents are experiencing the direct impact of infrastructure investment, sanitation provision, and behavioural change programming. These are four of their voices."
    ),
    heading('Ninfa Danjuma — Plateau State', 'h3'),
    block('On the SaTo pan sanitation initiative:'),
    quote(
      '"The SaTo pan is a very good initiative which my family and I have been enjoying. There is a great difference compared to using a pit latrine. Previously, people defecated in the backyard, making us uncomfortable. Now, with the SaTo pan, our backyard is much cleaner. I advise others who can afford it to install one to make the environment cleaner and reduce open defecation. I\'ve noticed fewer diseases caused by flies since the SaTo pan has a cover that prevents flies from carrying faeces to our food. I encourage everyone to not only install but continue using these toilets consistently."'
    ),
    heading('Chundung Pam — Plateau State', 'h3'),
    block('On reliable water access in her community:'),
    quote(
      '"We are immensely grateful for the SURWASH programme water project in our community. People can now access clean water and are delighted. The project has reduced diseases we previously faced from drinking contaminated water. Since the supply started, the water has flowed consistently. The water has been clean with no impurities. Our children no longer complain of certain ailments caused by dirty water, and hospital visits have decreased significantly. The pump has not broken down since installation, and we hope it continues working well."'
    ),
    heading('Malam Umar Iro — Kafir, Katsina State', 'h3'),
    block('On latrine provision in his community:'),
    quote(
      '"We extend our appreciation to the SURWASH programme and the Katsina State Government for providing latrines in our homes. This initiative represents a significant step towards ending open defecation in our community. We pledge to safeguard these projects from vandalism for the benefit of future generations."'
    ),
    heading('Musa Mamman Abu Baure — Baure, Katsina State', 'h3'),
    block('On the local economic impact of the programme:'),
    quote(
      '"We are grateful to the Katsina State Government and World Bank for executing these vital projects and for employing local residents among the workers, which helps reduce unemployment in our area."'
    ),
    heading('A Pattern Across the Testimonies'),
    block(
      "Read together, these four accounts point to something consistent: the impact of SURWASH is not abstract. Fewer hospital visits. Cleaner compounds. Children who no longer fall ill from dirty water. Young men employed in the construction and maintenance of the very infrastructure their families now depend on."
    ),
    block(
      "The programme's community engagement framework — which includes the establishment of Water Consumer Associations (WCAs), WASHCOMs, and Grievance Redress Committees (GRCs) — is designed to ensure that these gains are protected, maintained, and owned by the communities that depend on them."
    ),
    block("These voices are the measure of what the programme is for."),
  ];
}

function article5Content() {
  return [
    block(
      "The SURWASH Programme enters the next phase of its work from a position of demonstrated progress. Plateau State has hosted a World Bank Global Director and delivered verified infrastructure results. New states are onboarded and mobilising. The maiden edition of this newsletter is itself an accountability milestone — evidence that the programme is investing in its own transparency."
    ),
    block(
      "But the programme's leadership is focused forward. Seven key priorities will shape SURWASH's work in the coming quarters."
    ),
    heading('1. Expansion of Civil Works'),
    block(
      "States including Ekiti are planning additional civil works to enhance programme impact and facilitate the next round of fund disbursement under the PforR mechanism. Expanded construction activity signals growing state confidence and a pipeline of new infrastructure for communities that have waited long enough."
    ),
    heading('2. Strengthening WASH Data Systems'),
    block(
      "The WASH MAP training programme will continue to roll out, with a particular focus on Kaduna State — equipping stakeholders across all Local Government Areas with skills to install, manage, and analyse WASH data."
    ),
    heading('3. Stakeholder Engagement'),
    block(
      "Ongoing stakeholder meetings will ensure that service delivery remains aligned with community needs and that communities retain meaningful ownership of the WASH facilities built in their areas. Ownership is the mechanism through which infrastructure is maintained."
    ),
    heading('4. Capacity Building'),
    block(
      "Continued training sessions are planned for water facility maintenance teams, WASH committees, and other relevant stakeholders. Infrastructure without institutional capacity degrades. SURWASH is building both simultaneously."
    ),
    heading('5. Project Milestones and Inaugurations'),
    block(
      "The coming months will see the commissioning of completed projects, the launch of new ones, and announcements of additional funding opportunities — the public accountability moments that connect programme investment to community outcomes."
    ),
    heading('6. Evaluation of Additional States'),
    block(
      "The Federal Programme Implementation Unit (FPCU) will continue evaluating the readiness of Technical Assistance-supported states and other interested states for potential inclusion. States must demonstrate institutional readiness to participate in a performance-based system."
    ),
    heading('7. Policy and Institutional Reform'),
    block(
      "Further development of water policies, service delivery models, and tariff structures designed to ensure the long-term sustainability of WASH services. Infrastructure without policy reform is a temporary fix. Sustainable access to water requires a regulatory environment that outlasts any single investment cycle."
    ),
    heading('The Momentum Is Real'),
    block(
      "The Global Director's visit to Plateau State was a strong external validation of the progress SURWASH has made. But the programme's leadership is not resting on that validation. The focus ahead is on delivering sustainable, inclusive, and impactful WASH services at scale — in every participating state, in every community that has been promised access, and in every school and health facility that children and patients depend on."
    ),
    block("The work continues."),
  ];
}

// ─────────────────────────────────────────────
// STEP 3: Create articles
// ─────────────────────────────────────────────
async function createArticles(editionId) {
  const articles = [
    {
      slug: 're-introducing-surwash',
      title: "Re-Introducing SURWASH: Nigeria's Most Ambitious Water Reform Programme",
      stateScope: 'federal',
      postType: 'programme_overview',
      metaDescription:
        "Inadequate WASH conditions account for 73% of Nigeria's enteric disease burden — and over 255,000 preventable deaths every year. Here's the programme built to change that.",
      isFeatured: true,
      publishedAt: '2026-04-30T08:00:00.000Z',
      content: article1Content(),
    },
    {
      slug: 'message-from-the-honourable-minister',
      title: 'SURWASH Is Not Just a Programme — It Is a National Movement',
      stateScope: 'federal',
      postType: 'leadership_message',
      metaDescription:
        'The Honourable Minister of Water Resources and Sanitation opens the maiden edition of the SURWASH Newsletter with a charge to all stakeholders.',
      isFeatured: false,
      publishedAt: '2026-04-30T08:05:00.000Z',
      content: article2Content(),
    },
    {
      slug: 'global-directors-visit-plateau-state',
      title: 'A Global Endorsement: World Bank Director Visits Plateau State to Assess SURWASH Progress',
      stateScope: 'plateau',
      postType: 'state_spotlight',
      metaDescription:
        "Saroj Kumar Jha, Global Director for Water Global Practice at the World Bank, visited Plateau State this quarter — reaffirming international confidence in Nigeria's WASH reform journey.",
      isFeatured: false,
      publishedAt: '2026-04-30T08:10:00.000Z',
      content: article3Content(),
    },
    {
      slug: 'wash-voices-beneficiary-testimonials',
      title: 'WASH Voices: What Clean Water and Safe Sanitation Actually Mean',
      stateScope: 'plateau',
      postType: 'community',
      metaDescription:
        'Four beneficiaries from Plateau State and Katsina State share what the SURWASH Programme has meant for their families, their health, and their communities.',
      isFeatured: false,
      publishedAt: '2026-04-30T08:15:00.000Z',
      content: article4Content(),
    },
    {
      slug: 'whats-next-for-surwash',
      title: "What's Next: Seven Priorities Shaping SURWASH in the Coming Quarters",
      stateScope: 'federal',
      postType: 'forward_look',
      metaDescription:
        'From civil works expansion to policy reform, the SURWASH Programme has a clear forward agenda. Here is what stakeholders should expect in the months ahead.',
      isFeatured: false,
      publishedAt: '2026-04-30T08:20:00.000Z',
      content: article5Content(),
    },
  ];

  for (const article of articles) {
    // Check if it already exists
    const existing = await client.fetch(
      `*[_type == "post" && slug.current == $slug][0]._id`,
      { slug: article.slug }
    );

    if (existing) {
      console.log(`⚠️  Article already exists, patching edition link: "${article.title}"`);
      await client
        .patch(existing)
        .set({
          edition: { _type: 'reference', _ref: editionId },
          postType: article.postType,
          stateScope: article.stateScope,
        })
        .commit();
      console.log(`✅ Patched: ${article.slug}`);
    } else {
      console.log(`⏳ Creating article: "${article.title}"`);
      const created = await client.create({
        _type: 'post',
        title: article.title,
        slug: { _type: 'slug', current: article.slug },
        edition: { _type: 'reference', _ref: editionId },
        stateScope: article.stateScope,
        postType: article.postType,
        isFeatured: article.isFeatured,
        metaDescription: article.metaDescription,
        publishedAt: article.publishedAt,
        content: article.content,
      });
      console.log(`✅ Created: ${created._id} → /newsletter/${article.slug}`);
    }
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🚀 SURWASH Newsletter Seed Script\n');
  try {
    const editionId = await createEdition();
    await createArticles(editionId);
    console.log('\n✅ All done! Visit your Sanity Studio to review the content.');
    console.log('   Edition page: http://localhost:3000/newsletter/editions/march-april-2026\n');
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

main();
