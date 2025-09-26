import DecryptedText from '@/components/DecryptedText';

interface JobPosition {
  id: string;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract';
  duration?: string;
  location: string;
  department: string;
  status: 'open' | 'closed';
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits?: string[];
  postedDate: string;
}

const jobPositions: JobPosition[] = [
  {
    id: 'cloud-dev-intern',
    title: 'Cloud Developer Intern',
    type: 'Internship',
    duration: '6 months',
    location: 'Noida, Uttar Pradesh',
    department: 'Cloud Engineering',
    status: 'open',
    description: 'Join our cloud engineering team and gain hands-on experience with modern cloud platforms, DevOps practices, and scalable application development.',
    requirements: [
      'Currently pursuing or recently completed degree in Computer Science, IT, or related field',
      'Basic understanding of cloud platforms (AWS, Azure, or GCP)',
      'Familiarity with programming languages like Python, JavaScript, or Java',
      'Knowledge of version control systems (Git)',
      'Eager to learn and adapt to new technologies',
      'Strong communication and problem-solving skills'
    ],
    responsibilities: [
      'Assist in developing and deploying cloud-based applications',
      'Help with infrastructure automation and monitoring',
      'Support CI/CD pipeline development',
      'Collaborate with senior developers on cloud architecture',
      'Document processes and create technical guides',
      'Participate in code reviews and team meetings'
    ],
    benefits: [
      'Mentorship from experienced cloud engineers',
      'Hands-on experience with enterprise cloud platforms',
      'Certificate of completion',
      'Potential for full-time offer based on performance',
      'Flexible working hours'
    ],
    postedDate: '2024-09-25'
  },
  {
    id: 'fullstack-dev',
    title: 'Full Stack Developer',
    type: 'Full-time',
    location: 'Lucknow, Uttar Pradesh',
    department: 'Engineering',
    status: 'open',
    description: 'We are looking for a versatile Full Stack Developer to join our growing team and work on innovative web applications using modern technologies.',
    requirements: [
      '2+ years of experience in full stack development',
      'Proficiency in React, Next.js, TypeScript',
      'Experience with Node.js, Express.js, or similar backend frameworks',
      'Knowledge of databases (PostgreSQL, MongoDB)',
      'Understanding of cloud services and deployment',
      'Experience with version control and collaborative development'
    ],
    responsibilities: [
      'Develop and maintain web applications end-to-end',
      'Build responsive user interfaces using React/Next.js',
      'Design and implement RESTful APIs',
      'Optimize application performance and scalability',
      'Collaborate with designers and product managers',
      'Write clean, maintainable, and well-documented code'
    ],
    benefits: [
      'Competitive salary package',
      'Health insurance coverage',
      'Professional development opportunities',
      'Flexible work arrangements',
      'Annual performance bonuses'
    ],
    postedDate: '2024-09-20'
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    type: 'Full-time',
    location: 'Remote (India)',
    department: 'Infrastructure',
    status: 'open',
    description: 'Join our infrastructure team to build and maintain scalable deployment pipelines, monitoring systems, and cloud infrastructure.',
    requirements: [
      '3+ years of DevOps or Infrastructure experience',
      'Strong experience with AWS/Azure/GCP',
      'Proficiency in Docker, Kubernetes, and containerization',
      'Knowledge of Infrastructure as Code (Terraform, CloudFormation)',
      'Experience with CI/CD tools (Jenkins, GitLab CI, GitHub Actions)',
      'Scripting skills in Python, Bash, or PowerShell'
    ],
    responsibilities: [
      'Design and maintain CI/CD pipelines',
      'Manage cloud infrastructure and deployments',
      'Implement monitoring and alerting systems',
      'Ensure security and compliance across environments',
      'Automate repetitive tasks and processes',
      'Troubleshoot and resolve infrastructure issues'
    ],
    benefits: [
      'Remote work flexibility',
      'Competitive compensation',
      'Learning and certification budget',
      'Stock options',
      'Health and wellness benefits'
    ],
    postedDate: '2024-09-18'
  },
  {
    id: 'ui-ux-intern',
    title: 'UI/UX Design Intern',
    type: 'Internship',
    duration: '3-4 months',
    location: 'Noida, Uttar Pradesh',
    department: 'Design',
    status: 'open',
    description: 'Creative design internship opportunity to work on user interface and experience design for web and mobile applications.',
    requirements: [
      'Currently studying Design, HCI, or related field',
      'Proficiency in Figma, Adobe Creative Suite, or similar tools',
      'Basic understanding of design principles and user experience',
      'Portfolio demonstrating design projects',
      'Strong attention to detail and creativity',
      'Good communication skills'
    ],
    responsibilities: [
      'Create wireframes, mockups, and prototypes',
      'Assist in user research and usability testing',
      'Design user interfaces for web and mobile',
      'Collaborate with developers on implementation',
      'Maintain design systems and style guides',
      'Present design concepts to stakeholders'
    ],
    benefits: [
      'Portfolio development opportunities',
      'Mentorship from senior designers',
      'Exposure to real client projects',
      'Certificate and recommendations',
      'Networking opportunities'
    ],
    postedDate: '2024-09-22'
  }
];

export default function CareerPage() {
  const openPositions = jobPositions.filter(job => job.status === 'open');

  return (
    <main className="py-24 container max-w-6xl space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-wide">
          <DecryptedText 
            text="Join Our Team" 
            animateOn="view" 
            sequential 
            revealDirection="center"
            className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent"
          />
        </h1>
        <p className="max-w-3xl mx-auto text-lg text-slate-300 leading-relaxed">
          <DecryptedText 
            text="Shape the future of technology with us. We're building innovative solutions and looking for passionate individuals to join our mission."
            animateOn="view"
            speed={30}
            maxIterations={15}
          />
        </p>
      </section>

      {/* Company Culture */}
      <section className="grid gap-8 md:grid-cols-3">
        <div className="text-center space-y-3">
          <div className="text-4xl">🚀</div>
          <h3 className="font-semibold text-lg">Innovation First</h3>
          <p className="text-sm text-slate-400">Work with cutting-edge technologies and shape the future of digital solutions.</p>
        </div>
        <div className="text-center space-y-3">
          <div className="text-4xl">🤝</div>
          <h3 className="font-semibold text-lg">Collaborative Environment</h3>
          <p className="text-sm text-slate-400">Join a team that values collaboration, knowledge sharing, and mutual growth.</p>
        </div>
        <div className="text-center space-y-3">
          <div className="text-4xl">📈</div>
          <h3 className="font-semibold text-lg">Growth Opportunities</h3>
          <p className="text-sm text-slate-400">Continuous learning, skill development, and career advancement opportunities.</p>
        </div>
      </section>

      {/* Open Positions */}
      <section className="space-y-8">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">Open Positions</h2>
          <p className="text-slate-400">Discover opportunities that match your skills and aspirations</p>
        </div>

        <div className="grid gap-6 md:gap-8">
          {openPositions.map((job) => (
            <div key={job.id} className="border border-white/10 rounded-2xl p-6 md:p-8 bg-white/5 backdrop-blur-sm hover:border-white/20 transition-colors">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-heading text-xl font-semibold">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      job.status === 'open' 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {job.status === 'open' ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <span>💼</span> {job.type}
                    </span>
                    {job.duration && (
                      <span className="flex items-center gap-1">
                        <span>⏱️</span> {job.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span>📍</span> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🏢</span> {job.department}
                    </span>
                  </div>
                </div>
                <button className="shrink-0 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent rounded-lg font-medium hover:brightness-110 transition">
                  Apply Now
                </button>
              </div>

              <p className="text-slate-300 mb-6 leading-relaxed">{job.description}</p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-white">Requirements</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-brand-accent mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 text-white">Responsibilities</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {job.responsibilities.slice(0, 4).map((resp, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-brand-accent mt-1">•</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                    {job.responsibilities.length > 4 && (
                      <li className="text-slate-400 text-xs">+ {job.responsibilities.length - 4} more responsibilities</li>
                    )}
                  </ul>
                </div>
              </div>

              {job.benefits && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <h4 className="font-semibold mb-3 text-white">What We Offer</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((benefit, index) => (
                      <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-xs text-slate-300">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-12">
        <h2 className="font-heading text-2xl font-bold">Don't See the Right Fit?</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          We're always looking for talented individuals. Send us your resume and tell us how you'd like to contribute to our mission.
        </p>
        <a 
          href="/contact" 
          className="inline-block px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-medium hover:bg-white/20 transition"
        >
          Get in Touch
        </a>
      </section>
    </main>
  );
}