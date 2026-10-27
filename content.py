# ALL visible copy for the Khemistry inner pages. Edit a string here, then run: python3 build.py
# Keep the keys; change only the text in quotes. Curly apostrophes (’) are intentional.

SITE = {
    "phone_display": "+61 431 44 88 97",
    "phone_tel": "+61431448897",
    "email": "khemistry@khemistry.co",
    "location": "Melbourne, Australia",
    "tagline": "Because all good relationships start with Khemistry.",
    "align": "When people, place, and purpose align, extraordinary things can happen.",
    "legal": "© 2026 Khemistry Pty Ltd · ABN 70 563 414 048",
    "legal_tag": "TBC",
    "contact_label": "Contact a human:",
    "nav_contact": "Contact",
    "menu": "Menu",
    "skip": "Skip to content",
    "human_eyebrow": "Connecting humans",
    "human_h": "Contact a human",
    "call_prefix": "Call",
    "whole_h": "The whole formula",
    "formula_crumb": "The formula",
}

# Top navigation (file, label). Footer adds Home + Contact around these.
NAV = [("formula.html", "Formula"), ("people.html", "People"), ("place.html", "Place"),
       ("purpose.html", "Purpose"), ("about.html", "About"), ("insights.html", "Insights")]

# Element tiles: number, symbol, name
TILES = {"people": ("02", "Pp", "People"), "place": ("03", "Pl", "Place"),
         "purpose": ("04", "Pu", "Purpose"), "khemistry": ("01", "Kh", "Khemistry")}

RIGHTS = ["Right skills", "Right role", "Right team", "Right fit", "Right expectations", "Right aspirations"]

FORMULA = {
    "title": "Khemistry | The formula: People + Place + Purpose",
    "desc": "The Khemistry formula: the right people, the right place and a shared purpose. Melbourne recruitment and executive search by Maidlin Mistry.",
    "eyebrow": "The formula",
    "h1": "People + Place + Purpose = Khemistry",
    "tiles_label": "The elements",
    "people_h": "People", "people_more": "More on People →",
    "place_h": "Place", "place_lede": "The right place combines leadership, culture, challenge and opportunity.",
    "place_pull": "It’s where people thrive.", "place_more": "More on Place →",
    "purpose_h": "Purpose", "purpose_lede": "Knowing why you do what you do makes work more meaningful.",
    "purpose_body": "Shared purpose lifts engagement and enhances long-term success for people, teams and organisations.",
    "purpose_more": "More on Purpose →",
    "kh_h": "Khemistry",
}

PEOPLE = {
    "title": "Khemistry | People: the right skills, role, team and fit",
    "desc": "People: the right skills, role, team, fit, expectations and aspirations. Khemistry is a Melbourne recruitment and executive search firm founded by Maidlin Mistry.",
    "h1": "People",
    "hero": "The first element.",
    "eyebrow": "What the right person looks like",
    "body1": "We apply this approach to every role, from earlier career to C-suite. We don’t believe this should change because of position.",
    "body2": "We don’t advertise. We work with people we know, people they know, and through carefully curated direct approaches.",
}

PLACE = {
    "title": "Khemistry | Place: leadership, culture, challenge and opportunity",
    "desc": "Place: the right place combines leadership, culture, challenge and opportunity. Khemistry, Melbourne recruitment and executive search across Australia and South East Asia.",
    "h1": "Place",
    "hero": "The right place combines leadership, culture, challenge and opportunity.",
    "cards": [("11", "Ld", "Leadership", "glass"), ("12", "Cu", "Culture", "peach"),
              ("13", "Ch", "Challenge", "glass"), ("14", "Op", "Opportunity", "peach")],
    "pull": "It’s where people thrive.",
}

PURPOSE = {
    "title": "Khemistry | Purpose: why you do what you do",
    "desc": "Purpose: knowing why you do what you do makes work more meaningful. Khemistry, Melbourne recruitment and executive search founded by Maidlin Mistry.",
    "h1": "Purpose",
    "hero": "Knowing why you do what you do makes work more meaningful.",
    "eyebrow": "Shared purpose",
    "body": "Shared purpose lifts engagement and enhances long-term success for people, teams and organisations.",
}

ABOUT = {
    "title": "Khemistry | About Maidlin Mistry, founder",
    "desc": "About Khemistry and founder Maidlin Mistry: 25+ years of recruitment across Australia, South East Asia and the UK. Melbourne-based recruitment and executive search.",
    "eyebrow": "About · Connect",
    "h1": "Connecting humans",
    "lede": "Because all good relationships start with Khemistry.",
    "name": "Maidlin Mistry", "role": "· Founder",
    "portrait_alt": "Illustrated portrait of Maidlin Mistry, founder of Khemistry",
    "tile": ("01", "Mm", "Founder"),
    "h2": "Maidlin Mistry, founder",
    "paras": [
        "Khemistry was founded by Maidlin Mistry after a 25+ year recruitment career across Australia, South East Asia and the UK.",
        "Khemistry was built from conversations that became genuine connections and long term partnerships.",
        "We don’t advertise. We work with people we know, people they know, and through carefully curated direct approaches. We apply this approach to every role, from earlier career to C-suite. We don’t believe this should change because of position.",
        "Quite simply, we move quickly and deliver quality.",
        "Whether you’re exploring your next career move, hiring, or simply want to start a conversation, we’d love to hear from you.",
    ],
}

CONTACT = {
    "title": "Khemistry | Contact a human",
    "desc": "Contact Khemistry in Melbourne: call +61 431 44 88 97 or email khemistry@khemistry.co. Recruitment and executive search across Australia and South East Asia.",
    "eyebrow": "Contact",
    "h1": "Contact a human",
    "lede": "Whether you’re exploring your next career move, hiring, or simply want to start a conversation, we’d love to hear from you.",
    "msg_eyebrow": "Send a message", "msg_tag": "Placeholder",
    "msg_h": "Start a conversation",
    "f_name": "Name", "f_email": "Email", "f_message": "Message", "f_send": "Send via email",
    "form_note": "This form isn’t connected yet. Sending opens your email app addressed to khemistry@khemistry.co.",
    "nl_eyebrow": "Newsletter", "nl_tag": "Coming soon",
    "nl_h": "Insights, by email",
    "nl_label": "Email", "nl_btn": "Subscribe",
    "nl_note": "Newsletter sign-up isn’t live yet.",
}

INSIGHTS = {
    "title": "Khemistry | Insights (coming soon)",
    "desc": "Insights from Khemistry, a Melbourne recruitment and executive search firm founded by Maidlin Mistry. Coming soon.",
    "eyebrow": "Insights", "tag": "Coming soon",
    "h1": "Insights",
    "hero": "Coming soon.",
    "h2": "No posts yet",
    "body": "Articles will appear here once published. In the meantime, contact a human.",
}

# Home page. The hero carries only her wording: the wordmark, the founder lockup and the alignment line.
HOME = {
    "title": "Khemistry | Recruitment Melbourne | Maidlin Mistry",
    "desc": "Khemistry is a Melbourne recruitment and executive search firm founded by Maidlin Mistry, connecting people across Australia and South East Asia. When people, place and purpose align, extraordinary things can happen.",
    "credit_name": "Maidlin Mistry", "credit_role": "Founder",
    "cta_call": "Contact a human", "cta_email": "Email us",
    "skip_intro": "Skip intro", "replay": "Replay",
    "panel_close": "Close", "panel_more": "Explore the formula ↓",
    "formula_eyebrow": "The formula", "formula_h": "People. Place. Purpose.",
    "about_eyebrow": "About Khemistry", "about_h": "Connecting humans",
    "about_p": "Khemistry was founded by Maidlin Mistry after a 25+ year recruitment career across Australia, South East Asia and the UK. It was built from conversations that became genuine connections and long term partnerships.",
    "about_more": "About Maidlin →",
    "portrait_alt": "Illustrated portrait of Maidlin Mistry, founder of Khemistry",
}
