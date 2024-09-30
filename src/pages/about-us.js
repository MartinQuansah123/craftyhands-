import Layout from '@/components/Home/layout';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs = () => {
  return (
    <Layout className="bg-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">About Crafty Hands</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Discover and connect with skilled artisans who bring passion and creativity to their craft.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            At Crafty Hands, our mission is to celebrate and support artisans who create unique, handcrafted items with love and skill. We believe that every artisan deserves recognition and an opportunity to showcase their talent to a wider audience.
          </p>
          <p className="text-lg text-gray-700">
            We aim to connect customers with artisans who are passionate about their craft, providing a platform where quality meets creativity. Join us in celebrating craftsmanship and supporting local talent.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h3>
            <p className="text-lg text-gray-700">
              Crafty Hands was founded with a vision to bridge the gap between artisans and customers. Our journey began with a passion for handmade goods and a desire to provide a platform that amplifies the voices of talented craftsmen and craftswomen.
            </p>
            <p className="text-lg text-gray-700 mt-4">
              Over the years, we have grown into a vibrant community of artisans who share a common love for creating beautiful, handcrafted products. Our commitment is to offer a space where creativity thrives and quality is paramount.
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Meet the Team</h3>
            <div className="flex flex-wrap -m-4">
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-gray-200 rounded-lg p-6 text-center">
                  <img src="https://0.academia-photos.com/177255391/61615950/97889077/s200_kwabena_ansah.abedi.jpg" alt="Team Member 1"  className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">John Ansah</h4>
                  <p className="text-gray-600">Founder & CEO</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 p-4">
                <div className="bg-gray-200 rounded-lg p-6 text-center">
                  <img src="https://cocobod.gh/team_profile/DR.%20MRS.%20AGNES%20OWUSU-ANSAH686170861.jpg" alt="Team Member 2" className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Agnes Twum</h4>
                  <p className="text-gray-600">Marketing Director</p>
                </div>
              </div>
              {/* Add more team members as needed */}
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Get Involved</h2>
            <p className="text-lg text-gray-700 mb-6">
              Interested in joining our community or learning more about what we do? Feel free to reach out to us or follow us on social media.
            </p>
            <Link href="/contact-us">
              <span className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition duration-300">
                Contact Us
              </span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Crafty Hands. All rights reserved.</p>
        </div>
      </footer>
    </Layout>
  );
};

export default AboutUs;
