import type { PrivacyPolicyConfig } from "./types";

export const privacyPolicies: PrivacyPolicyConfig[] = [
  {
    slug: "rewire",
    appName: "Rewire",
    title: "Rewire Privacy Policy",
    lastUpdated: "January 2026",
    htmlContent: `
      <p><strong>Rewire</strong> is designed with privacy as a core principle. This policy explains what data is (and is not) collected when you use the app.</p>
      <h2>Data Processing</h2>
      <p>Rewire does not require an account and does not collect personal information such as your name, email address, location, contacts, or identifiers.</p>
      <p>All focus sessions, app blocking rules, and usage decisions are processed on-device using Apple’s Screen Time APIs. This data is not transmitted to external servers.</p>
      <h2>Analytics and Tracking</h2>
      <p>Rewire collects limited, anonymous usage analytics to understand how the app is used and to improve reliability and performance.</p>
      <p>This data may include high-level information such as feature usage counts, session starts or ends, and app version. No data is used for advertising, profiling, or cross-app tracking.</p>
      <p>Rewire does not track users across apps or websites and does not use advertising identifiers.</p>
      <h2>Children’s Privacy</h2>
      <p>Rewire is not directed at children under the age of 13. The app does not knowingly collect personal information from children.</p>
      <p>If you believe that personal data has been provided by a child in error, please contact us and we will take appropriate steps to remove it.</p>
      <h2>Contact</h2>
      <p>If you have any questions, contact <a href="mailto:support@scruffyhipster.com">support@scruffyhipster.com</a>.</p>
      <p>© 2026 Scruffy Hipster Ltd. All rights reserved.</p>
    `,
    seo: {
      title: "Rewire Privacy Policy | Scruffy Hipster",
      description: "Read the privacy policy for Rewire by Scruffy Hipster.",
      ogImage: "/og-default.svg"
    }
  },
  {
    slug: "wren",
    appName: "Wren",
    title: "Wren Privacy Policy",
    lastUpdated: "January 27, 2026",
    htmlContent: `
      <p><strong>Wren</strong> is designed with privacy as a core principle. This policy explains what data is (and is not) collected when you use the app.</p>
      <h2>Data We Collect</h2>
      <p>Wren’s current MVP does not collect HealthKit data. Optional session logs (date, type, duration) are stored locally on your device if you enable them.</p>
      <h2>How We Use Data</h2>
      <p>Local session logs are used to display your own history and trends. We do not use your data for advertising or sell it to third parties.</p>
      <h2>Advertising</h2>
      <p>Wren displays ads via Google AdMob. Ad services may collect device identifiers, approximate location, and ad interaction data to deliver and measure ads. We do not receive or store this data directly.</p>
      <p>Learn more about Google’s advertising policies and controls at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">policies.google.com/technologies/ads</a>.</p>
      <h2>Sharing and Storage</h2>
      <p>We do not transmit personal data from the MVP to our servers. Data stays on-device unless you choose to share it.</p>
      <h2>Future HealthKit Features</h2>
      <p>If HealthKit features are introduced, Wren will ask for explicit permission, explain the purpose, and aim to keep processing on-device.</p>
      <h2>Your Choices</h2>
      <p>You can disable optional logging at any time in the app. Deleting the app removes locally stored data.</p>
      <h2>Contact</h2>
      <p>If you have any questions, contact <a href="mailto:hello@scruffyhipster.com">hello@scruffyhipster.com</a>.</p>
      <p>© 2026 Scruffy Hipster Ltd. All rights reserved.</p>
    `,
    seo: {
      title: "Wren Privacy Policy | Scruffy Hipster",
      description: "Read the privacy policy for Wren by Scruffy Hipster.",
      ogImage: "/og-default.svg"
    }
  },
  {
    slug: "smarty-colours",
    appName: "Smarty Colours",
    title: "Smarty Colours Privacy Policy",
    lastUpdated: "January 30, 2026",
    htmlContent: `
      <p><strong>Smarty Colours</strong> is a kids colouring book app. We value your privacy and do not collect, store, or transmit any personal data.</p>
      <h2>Data Collection</h2>
      <p>Smarty Colours does not collect any personal information. The app has no accounts, logins, analytics, tracking, or advertising.</p>
      <h2>Data Sharing</h2>
      <p>We do not share any data with third parties because we do not collect any.</p>
      <h2>Children’s Privacy</h2>
      <p>Smarty Colours is designed for children. Since no data is collected, there is no personal information to share or sell.</p>
      <h2>Contact</h2>
      <p>If you have any questions, contact <a href="mailto:support@scruffyhipster.com">support@scruffyhipster.com</a>.</p>
      <p>© 2026 Scruffy Hipster Ltd. All rights reserved.</p>
    `,
    seo: {
      title: "Smarty Colours Privacy Policy | Scruffy Hipster",
      description: "Read the privacy policy for Smarty Colours by Scruffy Hipster.",
      ogImage: "/og-default.svg"
    }
  },
  {
    slug: "chat-with-santa",
    appName: "Chat with Santa",
    title: "Chat with Santa Privacy Policy",
    lastUpdated: "October 2025",
    htmlContent: `
      <p><strong>Chat with Santa</strong> values your privacy. The app does not collect, store, or transmit any personal data.</p>
      <h2>Data Processing</h2>
      <p>All conversations with Santa are processed entirely on your device using Apple’s Foundation Model or an on-device Llama model. No chat data ever leaves your device, and no information is shared with any external servers or third parties.</p>
      <h2>Analytics and Tracking</h2>
      <p>Chat with Santa does not use analytics, tracking tools, or advertising technologies.</p>
      <h2>Children’s Privacy</h2>
      <p>This app is suitable for all ages. Since no data is collected, it fully complies with child privacy standards, including COPPA and GDPR-K.</p>
      <h2>Contact</h2>
      <p>If you have any questions, contact <a href="mailto:support@scruffyhipster.com">support@scruffyhipster.com</a>.</p>
      <p>© 2025 Scruffy Hipster Ltd. All rights reserved.</p>
    `,
    seo: {
      title: "Chat with Santa Privacy Policy | Scruffy Hipster",
      description: "Read the privacy policy for Chat with Santa by Scruffy Hipster.",
      ogImage: "/og-default.svg"
    }
  }
];

export const privacyPoliciesBySlug = new Map(privacyPolicies.map((policy) => [policy.slug, policy]));

