import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url('./watches/watch3.jpeg')`,
        }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            About <span className="text-indigo-400">Our Brand</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto">
            Discover our story, mission, and the passionate team behind our journey.
          </p>
        </motion.div>
      </section>

      {/* Brand Story */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <motion.img
            src="./watches/watch2.jpeg"
            alt="Our Story"
            className="rounded-2xl shadow-lg w-full md:w-1/2 object-cover"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />
          <motion.div
            className="md:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We started with a simple idea — to create quality products that inspire confidence and bring joy.
              From humble beginnings, our passion for design, craftsmanship, and customer satisfaction
              has driven us to where we are today.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every product is thoughtfully crafted, ensuring it not only meets but exceeds your expectations.
              We’re not just building a brand — we’re building a community.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-800 text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-4">
            To deliver high-quality, sustainable products that make everyday life better — while empowering communities and caring for our planet.
          </p>
          <p className="text-lg leading-relaxed">
            We believe in transparency, innovation, and authenticity. Every purchase helps us move closer to a greener, fairer future.
          </p>
        </motion.div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16 px-6 md:px-20 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {[
              {
                name: "David Smith",
                role: "Founder & CEO",
                img: "https://randomuser.me/api/portraits/men/22.jpg",
              },
              {
                name: "Sophia Lee",
                role: "Creative Director",
                img: "https://randomuser.me/api/portraits/women/45.jpg",
              },
              {
                name: "Liam Johnson",
                role: "Product Designer",
                img: "https://randomuser.me/api/portraits/men/76.jpg",
              },
            ].map((member, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-20 bg-slate-700 text-white text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Journey
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Be part of our growing community and experience the passion, creativity,
            and care we put into everything we do.
          </p>
          <a
            href="/shop"
            className="inline-block bg-white text-slate-700 font-semibold px-8 py-3 rounded-full shadow hover:bg-gray-200 transition"
          >
            Explore Our Collection
          </a>
        </motion.div>
      </section>
    </div>
  );
}
