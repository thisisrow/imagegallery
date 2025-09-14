import { motion } from 'framer-motion';

export const Team = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Lead Photographer",
      image: "/images/1.jpg",
      description: "Specializes in portrait and lifestyle photography with over 8 years of experience."
    },
    {
      name: "Michael Chen",
      role: "Creative Director",
      image: "/images/2.jpg", 
      description: "Visionary behind our creative projects and brand development."
    },
    {
      name: "Emma Rodriguez",
      role: "Photo Editor",
      image: "/images/3.jpg",
      description: "Expert in post-production and digital enhancement techniques."
    },
    {
      name: "David Kim",
      role: "Studio Manager",
      image: "/images/4.jpg",
      description: "Oversees operations and ensures smooth project delivery."
    }
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-12">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-6xl font-serif text-black mb-8 text-center">
            Our Team
          </h1>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-12 text-center max-w-3xl mx-auto">
            Meet the talented individuals behind our creative vision. Each team member brings 
            unique skills and passion to every project we undertake.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-lg shadow-md overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-serif text-black mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
