import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../firebase.config'; // Firebase configuration
import { useRouter } from 'next/router';

const ClientBookedArtisans = () => {
  const router = useRouter();
  const { id } = router.query; // Client's ID (current user's ID)
  const [bookedArtisans, setBookedArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookedArtisans = async () => {
      try {
        // Fetch job bookings where clientId matches the current user's id (Client)
        const bookingsQuery = query(collection(db, 'jobbooking'), where('clientId', '==', id));
        const bookingsSnapshot = await getDocs(bookingsQuery);
        const bookingsData = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Update the state with the booked artisans data
        setBookedArtisans(bookingsData);
      } catch (error) {
        console.error('Error fetching booked artisans:', error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookedArtisans();
    }
  }, [id]);

  const truncateString = (str, maxLength) => {
    if (str.length > maxLength) {
      return str.slice(0, maxLength) + '...';
    }
    return str;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <section>
      <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">Booked Artisans</h2>
          <p className="text-gray-600 mt-4">Here are all the artisans you&apos;ve booked.</p>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <h3 className="text-xl font-bold mb-4">Artisans</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {bookedArtisans.length > 0 ? (
                bookedArtisans.map((booking) => (
                  <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
                    <div className="h-38 flex flex-col justify-center items-center bg-[url('https://preline.co/assets/svg/examples/abstract-bg-1.svg')] bg-no-repeat bg-cover bg-center rounded-t-xl">
                      <img src={booking.artisanImage || '/default-avatar.png'} alt="artisan image" className='w-full h-38 rounded-md' />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{truncateString(booking.artisanName || 'Artisan', 15)}</h4>
                    <p className="text-gray-600 mb-2">{truncateString(booking.jobDetails || 'Specialty not available', 15)}</p>
                    <p className="text-gray-800 font-semibold">Booking Status: {booking.feedback}</p>
                    <p className="text-gray-600">Date: {new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">You haven&apos;t booked any artisans yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientBookedArtisans;
