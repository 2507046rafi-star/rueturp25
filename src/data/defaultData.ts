import { Student, Notice, GalleryItem, AdminSettings } from "../types";

export const DEFAULT_STUDENTS: Student[] = [
  {
    roll: "2017001",
    name: "Abrar Shakib",
    mobiles: ["01712-345678", "01987-654321"],
    emails: ["abrar.shakib@ruet.ac.bd", "shakib.urp25@gmail.com"],
    facebook: "https://facebook.com/abrar.shakib.urp",
    bio: "Passionate about geographic information systems (GIS), urban zoning policies, and smart city infrastructure design. Always trying to bridge academic learning with practical field applications.",
    avatar: "",
    tags: ["CR", "GIS Enthusiast"]
  },
  {
    roll: "2017012",
    name: "Fariha Sultana",
    mobiles: ["01823-456789"],
    emails: ["fariha.sultana@ruet.ac.bd"],
    facebook: "https://facebook.com/fariha.sultana.urp25",
    bio: "Enthusiastic about sustainable transport systems, environmental impact assessment (EIA), and regional development frameworks. Active volunteer in local green initiatives.",
    avatar: "",
    tags: ["Academic Rep"]
  },
  {
    roll: "2017024",
    name: "Sadat Rahman Khan",
    mobiles: ["01750-121454"],
    emails: ["sadaturp25@gmail.com", "sadat.urp.ruet@gmail.com"],
    facebook: "https://facebook.com/sadat.rahman.urp25",
    bio: "Liaison Officer and Student Representative. Highly interested in Urban Economics, Spatial Analytics, and Community Engagement. Managing batch databases, cloud collections, and alumni links.",
    avatar: "",
    tags: ["CR", "Web Coordinator"]
  },
  {
    roll: "2017035",
    name: "Tanvir Ahmed",
    mobiles: ["01515-998877", "01700-112233"],
    emails: ["tanvir.urp25@ruet.ac.bd"],
    facebook: "https://facebook.com/tanvir.ahmed.urp",
    bio: "Fascinated by high-end architectural renderings, urban landscape planning, and AutoCAD modeling. Passionate about professional photography and capturing campus life.",
    avatar: "",
    tags: ["Photography Lead"]
  },
  {
    roll: "2017046",
    name: "Zerin Tasnim",
    mobiles: ["01633-445566"],
    emails: ["zerin.tasnim@ruet.ac.bd", "zerin.urp25@gmail.com"],
    facebook: "https://facebook.com/zerin.tasnim.urp",
    bio: "Specializing in Disaster Management planning and climate resilient housing structures. I love painting, architectural sketching, and organizing batch programs.",
    avatar: "",
    tags: ["Cultural Coordinator"]
  },
  {
    roll: "2017058",
    name: "Imran Chowdhury",
    mobiles: ["01911-223344"],
    emails: ["imran.chy@ruet.ac.bd"],
    facebook: "https://facebook.com/imran.chy.urp25",
    bio: "GIS developer and remote sensing programmer. Dedicated to creating modern Python-based analytical tools for mapping local housing density and zoning trends.",
    avatar: "",
    tags: ["Tech Expert"]
  }
];

export const DEFAULT_NOTICES: Notice[] = [
  {
    id: "not-1",
    title: "1st Year Semester Final Syllabus & Preparation Guidelines",
    content: "All students are requested to download the updated course curriculum for the 1st year (Theory and Sessionals). Draft planning studio sheets must be submitted to the studio advisors by next Wednesday. Double-check that your sheets conform to metric scaling standards.",
    date: "2026-06-20",
    author: "Dept. Office"
  },
  {
    id: "not-2",
    title: "Upcoming Academic Excursion to Rajshahi City Corporation (RCC)",
    content: "As part of the URP'25 spatial survey studio, an academic field excursion has been scheduled for this Thursday. We will be analyzing historical zoning plans and modern municipal solid waste disposal units. Transportation leaves RUET campus gate at 8:00 AM sharp. Dress code is formal.",
    date: "2026-06-22",
    author: "Sadat Rahman (CR)"
  },
  {
    id: "not-3",
    title: "GIS Studio Access and Lab Hours Schedule Update",
    content: "The URP Department computer laboratory will remain open from 8:00 AM to 6:00 PM on weekdays to facilitate students working on ArcMap, QGIS, and Google Earth Engine studio projects. Please register your roll numbers at the entrance logbook.",
    date: "2026-06-18",
    author: "Lab Administrator"
  }
];

export const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    title: "Field Survey at Rajshahi Town Protection Embankment",
    caption: "The batch URP'25 conducts an in-depth riverbank morphologic and land-use survey along the Padma River boundary. Students used real-time GPS coordinates and hand-drafted base map charts to visualize local urbanization effects.",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    category: "Academic",
    date: "2026-05-15"
  },
  {
    id: "gal-2",
    title: "Intra-Department Football League Champions",
    caption: "URP Batch 2025 clinches the championship trophy at the RUET Inter-batch sports festival. A brilliant team performance and a cheering gallery of batchmates made it an unforgettable afternoon.",
    imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80",
    category: "Extra-curriculum",
    date: "2026-06-05"
  },
  {
    id: "gal-3",
    title: "Architectural Drafting and Studio Modeling Session",
    caption: "Students hard at work during our foundational planning studio course. Developing physical models of eco-friendly community spaces and sketching detailed isometric house views under supervision.",
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80",
    category: "Academic",
    date: "2026-04-10"
  },
  {
    id: "gal-4",
    title: "Vibrant Batch Day Festival at RUET Cafeteria",
    caption: "Celebrating togetherness, URP'25 batch day with beautiful acoustic performances, stand-up comedy, and local sweets. Strengthening the life-long bonds of the batch family.",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
    category: "Extra-curriculum",
    date: "2026-05-01"
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  aboutUs: `Rajshahi University of Engineering and Technology (RUET) is one of the premier public engineering universities in Bangladesh. The department of Urban and Regional Planning (URP) is an exceptional department dedicated to cultivating future planners, smart developers, and policy professionals. 

Batch 2025 of RUET URP represents a cohort of ambitious, brilliant students equipped with spatial design thinking, GIS proficiency, and regional drafting skills. This official website acts as our central hub for academic announcements, resource libraries, student rosters, and project exhibits. Here, we coordinate studio tasks, share digital drives, manage notices, and present our ongoing academic milestones to the outer world.`,
  aboutUsImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
  policy: `## Website Use & Policy

1. **Academic Honesty & Ethics**: This website serves as an official platform for academic resource sharing. All resources uploaded to the drives must comply with academic integrity rules of RUET.
2. **Access Control**: Drive links and software tools are hosted for URP'25 batch students' personal learning and project work. Unauthorized commercial reproduction of batch resources is prohibited.
3. **Data Privacy**: Personal details such as contact numbers and emails are published with explicit student consent. Any scraping or harassment based on student directories is strictly illegal.
4. **Platform Security**: The Admin Panel is securely locked. Only the designated administrator and developer can edit, add, or delete notices and batch information.

For inquiries or updates, please reach out to the Web Coordinator, Sadat Rahman Khan.`
};
