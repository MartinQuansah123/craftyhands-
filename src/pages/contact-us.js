import Layout from '@/components/Home/layout';
import Image from 'next/image';
import Link from 'next/link';

const ContactUs = () => {
  return (
    <Layout className="bg-gray-100 min-h-screen">
      <header className="bg-gradient-to-r from-blue-500 to-teal-500 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have questions, feedback, or just want to say hello, feel free to reach out to us.
          </p>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <section className="bg-white shadow-lg rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Contact Details</h2>
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2 mb-6 md:mb-0">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Address</h3>
              <p className="text-lg text-gray-700">
                Crafty Hands HQ<br />
                Greater Accra<br />
                Tesano
              </p>
              <p className="text-lg text-gray-700 mt-4">
                <strong>Phone:</strong> (020) 456-7890
              </p>
              <p className="text-lg text-gray-700 mt-2">
                <strong>Email:</strong> <a href="mailto:contact@craftyhands.vercel.app" className="text-blue-500 hover:underline">contact@craftyhands.vercel.app</a>
              </p>
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Find Us</h3>
              <div className="relative h-64 rounded-lg overflow-hidden">
                {/* Replace with your actual map URL */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15882.966857685878!2d-0.23664205!3d5.60511875!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf99764996816b%3A0x8486a2454905be11!2sTesano%2C%20Accra!5e0!3m2!1sen!2sgh!4v1726339102596!5m2!1sen!2sgh"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                ></iframe>
               
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 py-12">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Connect With Us</h2>
            <p className="text-lg text-gray-700 mb-6">
              Follow us on social media to stay updated with our latest news and events.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="https://facebook.com/craftyhands" className="text-blue-600 hover:text-blue-800 w-10 h-10">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjvzC_QRv6moAhgNb5C6e3yicKgFND1g2RwA&s" alt="Facebook" className="text-blue-600 hover:text-blue-800 w-10 h-10" />
              </Link>
              <Link href="https://twitter.com/craftyhands" className="text-blue-400 hover:text-blue-600">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7fj1vqat9XLO4cFwOG1uFqLXYDcISiYil2w&s" alt="Twitter" className="text-blue-600 hover:text-blue-800 w-10 h-10" />
              </Link>
              <Link href="https://instagram.com/craftyhands" className="text-pink-500 hover:text-pink-700">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/2048px-Instagram_logo_2016.svg.png" alt="Instagram" className="text-blue-600 hover:text-blue-800 w-10 h-10" />
              </Link>
              {/* Add more social media icons as needed */}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Crafty Hands. All rights reserved.</p>
          <Link href="/">
            <span className="text-gray-400 hover:text-white">Back to Home</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
};

export default ContactUs;
